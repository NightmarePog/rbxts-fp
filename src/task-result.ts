import type { Effect } from "@/effect";
import { err, ok, Result, type Result as ResultValue } from "@/result";

/**
 * A cold asynchronous operation with a typed expected-failure channel.
 *
 * Calling the function starts fresh work. Expected failures resolve as Err;
 * unexpected failures and cancellation remain native Promise behavior.
 */
export type TaskResult<A, E> = () => Promise<ResultValue<A, E>>;

export function succeed<A, E = never>(value: A): TaskResult<A, E> {
	return () => Promise.resolve(ok<A, E>(value));
}

export function fail<E, A = never>(errorValue: E): TaskResult<A, E> {
	return () => Promise.resolve(err<E, A>(errorValue));
}

export function fromResult<A, E>(result: ResultValue<A, E>): TaskResult<A, E> {
	return () => Promise.resolve(result);
}

/** Lifts a synchronous Effect; thrown defects become native Promise rejections. */
export function fromEffect<A, E>(effect: Effect<A, E>): TaskResult<A, E> {
	return () => Promise.try(effect);
}

/** Converts a Promise rejection into a typed error only through the explicit mapper. */
export function fromPromise<A, E>(factory: () => Promise<A>, onRejected: (reason: unknown) => E): TaskResult<A, E> {
	return () =>
		factory().andThen(
			(value) => ok<A, E>(value),
			(reason: unknown) => err<E, A>(onRejected(reason)),
		);
}

export function run<A, E>(task: TaskResult<A, E>): Promise<ResultValue<A, E>> {
	return task();
}

export function map<A, E, B>(task: TaskResult<A, E>, transform: (value: A) => B): TaskResult<B, E> {
	return () => task().andThen((result) => (result.type === "ok" ? ok<B, E>(transform(result.value)) : result));
}

export function mapErr<A, E, F>(task: TaskResult<A, E>, transform: (errorValue: E) => F): TaskResult<A, F> {
	return () => task().andThen((result) => (result.type === "err" ? err<F, A>(transform(result.error)) : result));
}

export function flatMap<A, E, B, F>(
	task: TaskResult<A, E>,
	transform: (value: A) => TaskResult<B, F>,
): TaskResult<B, E | F> {
	return () => {
		// The explicit output argument teaches Promise.andThen that both Result
		// error channels widen into the same union without runtime adapters.
		return task().andThen<ResultValue<B, E | F>>((result) =>
			result.type === "ok" ? transform(result.value)() : result,
		);
	};
}

export function recover<A, E, B>(task: TaskResult<A, E>, recovery: (errorValue: E) => B): TaskResult<A | B, never> {
	return () => task().andThen((result) => Result.recover(result, recovery));
}

export function orElse<A, E, B, F>(
	task: TaskResult<A, E>,
	recovery: (errorValue: E) => TaskResult<B, F>,
): TaskResult<A | B, F> {
	return () => {
		// This is the recovery-side equivalent of flatMap's explicit widening.
		return task().andThen<ResultValue<A | B, F>>((result) =>
			result.type === "ok" ? result : recovery(result.error)(),
		);
	};
}

export function tap<A, E>(task: TaskResult<A, E>, effect: (value: A) => void): TaskResult<A, E> {
	return () => task().andThen((result) => Result.tap(result, effect));
}

export function tapErr<A, E>(task: TaskResult<A, E>, effect: (errorValue: E) => void): TaskResult<A, E> {
	return () => task().andThen((result) => Result.tapErr(result, effect));
}

/** Starts both tasks together. Result errors prefer the left task. */
export function zip<A, E, B, F>(left: TaskResult<A, E>, right: TaskResult<B, F>): TaskResult<readonly [A, B], E | F> {
	return () =>
		Promise.all([left(), right()]).andThen(([leftResult, rightResult]) => Result.zip(leftResult, rightResult));
}

/** Starts every task together and returns the first Err in input order. */
export function all<A extends defined, E>(tasks: ReadonlyArray<TaskResult<A, E>>): TaskResult<A[], E> {
	return () => {
		const promises = tasks.map((task) => task());
		return Promise.all<Array<Promise<ResultValue<A, E>>>>(promises).andThen((results) => {
			const values = new Array<A>();
			for (const result of results) {
				if (result.type === "err") return result;
				values.push(result.value);
			}
			return ok(values);
		});
	};
}

function retryAttempt<A, E>(
	task: TaskResult<A, E>,
	retriesRemaining: number,
	shouldRetry: (errorValue: E, attempt: number) => boolean,
	attempt: number,
	delaySeconds?: number,
): Promise<ResultValue<A, E>> {
	return task().andThen((result) => {
		if (result.type === "ok" || retriesRemaining <= 0 || !shouldRetry(result.error, attempt)) return result;

		if (delaySeconds !== undefined) {
			return Promise.delay(delaySeconds).andThen(() =>
				retryAttempt(task, retriesRemaining - 1, shouldRetry, attempt + 1, delaySeconds),
			);
		}

		return retryAttempt(task, retriesRemaining - 1, shouldRetry, attempt + 1);
	});
}

/** Retries typed Err results. `retries` counts additional attempts after the first. */
export function retry<A, E>(
	task: TaskResult<A, E>,
	retries: number,
	shouldRetry: (errorValue: E, attempt: number) => boolean = () => true,
): TaskResult<A, E> {
	return () => retryAttempt(task, retries, shouldRetry, 1);
}

/** Retries typed Err results after a Promise-native cancellable delay. */
export function retryWithDelay<A, E>(
	task: TaskResult<A, E>,
	retries: number,
	delaySeconds: number,
	shouldRetry: (errorValue: E, attempt: number) => boolean = () => true,
): TaskResult<A, E> {
	return () => retryAttempt(task, retries, shouldRetry, 1, delaySeconds);
}

/**
 * Cancels the source task and resolves with a typed timeout error when the
 * deadline wins. Source rejections remain rejections.
 */
export function timeout<A, E, F>(task: TaskResult<A, E>, seconds: number, onTimeout: () => F): TaskResult<A, E | F> {
	return () =>
		new Promise<ResultValue<A, E | F>>((resolve, reject, onCancel) => {
			const source = task();
			const timer = Promise.delay(seconds);
			let settled = false;

			onCancel(() => {
				source.cancel();
				timer.cancel();
			});

			source.andThen(
				(result) => {
					if (settled) return;
					settled = true;
					timer.cancel();
					resolve(result);
				},
				(reason: unknown) => {
					if (settled) return;
					settled = true;
					timer.cancel();
					reject(reason);
				},
			);

			timer.andThen(() => {
				if (settled) return;
				settled = true;
				source.cancel();
				resolve(err<F, A>(onTimeout()));
			});
		});
}

export function mapWith<A, E, B>(transform: (value: A) => B): (task: TaskResult<A, E>) => TaskResult<B, E> {
	return (task) => map(task, transform);
}

export function mapErrWith<A, E, F>(transform: (errorValue: E) => F): (task: TaskResult<A, E>) => TaskResult<A, F> {
	return (task) => mapErr(task, transform);
}

export function flatMapWith<A, E, B, F>(
	transform: (value: A) => TaskResult<B, F>,
): (task: TaskResult<A, E>) => TaskResult<B, E | F> {
	return (task) => flatMap(task, transform);
}

export function recoverWith<A, E, B>(
	recovery: (errorValue: E) => B,
): (task: TaskResult<A, E>) => TaskResult<A | B, never> {
	return (task) => recover(task, recovery);
}

export function orElseWith<A, E, B, F>(
	recovery: (errorValue: E) => TaskResult<B, F>,
): (task: TaskResult<A, E>) => TaskResult<A | B, F> {
	return (task) => orElse(task, recovery);
}

export const TaskResult = {
	succeed,
	fail,
	fromResult,
	fromEffect,
	fromPromise,
	run,
	map,
	mapErr,
	flatMap,
	recover,
	orElse,
	tap,
	tapErr,
	zip,
	all,
	retry,
	retryWithDelay,
	timeout,
	mapWith,
	mapErrWith,
	flatMapWith,
	recoverWith,
	orElseWith,
};
