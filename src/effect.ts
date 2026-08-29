import { err, ok, Result, type Result as ResultValue } from "@/result";

/** A cold synchronous operation with a typed expected-failure channel. */
export type Effect<A, E> = () => ResultValue<A, E>;

export function succeed<A, E = never>(value: A): Effect<A, E> {
	return () => ok<A, E>(value);
}

export function fail<E, A = never>(errorValue: E): Effect<A, E> {
	return () => err<E, A>(errorValue);
}

export function fromResult<A, E>(result: ResultValue<A, E>): Effect<A, E> {
	return () => result;
}

/** Defers synchronous work. Thrown errors remain defects and are not typed failures. */
export function sync<A>(evaluate: () => A): Effect<A, never> {
	return () => ok(evaluate());
}

/** Defers synchronous work and explicitly maps a thrown value into the typed error channel. */
export function tryEffect<A, E>(evaluate: () => A, onThrow: (reason: unknown) => E): Effect<A, E> {
	return () => {
		const [succeeded, value] = pcall(evaluate);
		return succeeded ? ok<A, E>(value) : err<E, A>(onThrow(value));
	};
}

/** Defers a function that already describes expected failure with Result. */
export function tryResult<A, E>(evaluate: () => ResultValue<A, E>): Effect<A, E> {
	return evaluate;
}

/** Defers construction of another Effect, useful for recursion and conditional programs. */
export function suspend<A, E>(evaluate: () => Effect<A, E>): Effect<A, E> {
	return () => evaluate()();
}

export function run<A, E>(effect: Effect<A, E>): ResultValue<A, E> {
	return effect();
}

export function map<A, E, B>(effect: Effect<A, E>, transform: (value: A) => B): Effect<B, E> {
	return () => {
		const result = effect();
		return result.type === "ok" ? ok(transform(result.value)) : result;
	};
}

export function mapErr<A, E, F>(effect: Effect<A, E>, transform: (errorValue: E) => F): Effect<A, F> {
	return () => {
		const result = effect();
		return result.type === "err" ? err(transform(result.error)) : result;
	};
}

export function flatMap<A, E, B, F>(effect: Effect<A, E>, transform: (value: A) => Effect<B, F>): Effect<B, E | F> {
	return () => {
		const result = effect();
		return result.type === "ok" ? transform(result.value)() : result;
	};
}

export function recover<A, E, B>(effect: Effect<A, E>, recovery: (errorValue: E) => B): Effect<A | B, never> {
	return () => Result.recover(effect(), recovery);
}

export function orElse<A, E, B, F>(effect: Effect<A, E>, recovery: (errorValue: E) => Effect<B, F>): Effect<A | B, F> {
	return () => {
		const result = effect();
		return result.type === "ok" ? result : recovery(result.error)();
	};
}

export function tap<A, E>(effect: Effect<A, E>, observe: (value: A) => void): Effect<A, E> {
	return () => Result.tap(effect(), observe);
}

export function tapErr<A, E>(effect: Effect<A, E>, observe: (errorValue: E) => void): Effect<A, E> {
	return () => Result.tapErr(effect(), observe);
}

/** Runs left-to-right and stops before running the right Effect when the left fails. */
export function zip<A, E, B, F>(left: Effect<A, E>, right: Effect<B, F>): Effect<readonly [A, B], E | F> {
	return () => {
		const leftResult = left();
		if (leftResult.type === "err") return leftResult;
		const rightResult = right();
		return rightResult.type === "err" ? rightResult : ok([leftResult.value, rightResult.value] as const);
	};
}

/** Runs left-to-right and stops at the first Err. */
export function all<A extends defined, E>(effects: ReadonlyArray<Effect<A, E>>): Effect<A[], E> {
	return () => {
		const values = new Array<A>();
		for (const effect of effects) {
			const result = effect();
			if (result.type === "err") return result;
			values.push(result.value);
		}
		return ok(values);
	};
}

/** Runs a finalizer after success, typed failure, or a thrown defect. */
export function ensuring<A, E>(effect: Effect<A, E>, finalizer: Effect<void, never>): Effect<A, E> {
	return () => {
		try {
			return effect();
		} finally {
			finalizer();
		}
	};
}

/** Acquires a resource, uses it, and always finalizes it after successful acquisition. */
export function acquireUseRelease<Resource, AcquireError, A, UseError>(
	acquire: Effect<Resource, AcquireError>,
	use: (resource: Resource) => Effect<A, UseError>,
	release: (resource: Resource) => Effect<void, never>,
): Effect<A, AcquireError | UseError> {
	return () => {
		const acquired = acquire();
		if (acquired.type === "err") return acquired;

		try {
			return use(acquired.value)();
		} finally {
			release(acquired.value)();
		}
	};
}

export function lift<Arguments extends unknown[], A>(
	operation: (...arguments_: Arguments) => A,
): (...arguments_: Arguments) => Effect<A, never> {
	return (...arguments_) => sync(() => operation(...arguments_));
}

export function liftResult<Arguments extends unknown[], A, E>(
	operation: (...arguments_: Arguments) => ResultValue<A, E>,
): (...arguments_: Arguments) => Effect<A, E> {
	return (...arguments_) => tryResult(() => operation(...arguments_));
}

export function mapWith<A, E, B>(transform: (value: A) => B): (effect: Effect<A, E>) => Effect<B, E> {
	return (effect) => map(effect, transform);
}

export function mapErrWith<A, E, F>(transform: (errorValue: E) => F): (effect: Effect<A, E>) => Effect<A, F> {
	return (effect) => mapErr(effect, transform);
}

export function flatMapWith<A, E, B, F>(
	transform: (value: A) => Effect<B, F>,
): (effect: Effect<A, E>) => Effect<B, E | F> {
	return (effect) => flatMap(effect, transform);
}

export function recoverWith<A, E, B>(recovery: (errorValue: E) => B): (effect: Effect<A, E>) => Effect<A | B, never> {
	return (effect) => recover(effect, recovery);
}

export function orElseWith<A, E, B, F>(
	recovery: (errorValue: E) => Effect<B, F>,
): (effect: Effect<A, E>) => Effect<A | B, F> {
	return (effect) => orElse(effect, recovery);
}

export const Effect = {
	succeed,
	fail,
	fromResult,
	sync,
	try: tryEffect,
	tryResult,
	suspend,
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
	ensuring,
	acquireUseRelease,
	lift,
	liftResult,
	mapWith,
	mapErrWith,
	flatMapWith,
	recoverWith,
	orElseWith,
};
