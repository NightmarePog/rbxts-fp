import type { Effect } from "./effect";
import { type Result as ResultValue } from "./result";
/**
 * A cold asynchronous operation with a typed expected-failure channel.
 *
 * Calling the function starts fresh work. Expected failures resolve as Err;
 * unexpected failures and cancellation remain native Promise behavior.
 */
export type TaskResult<A, E> = () => Promise<ResultValue<A, E>>;
export declare function succeed<A, E = never>(value: A): TaskResult<A, E>;
export declare function fail<E, A = never>(errorValue: E): TaskResult<A, E>;
export declare function fromResult<A, E>(result: ResultValue<A, E>): TaskResult<A, E>;
/** Lifts a synchronous Effect; thrown defects become native Promise rejections. */
export declare function fromEffect<A, E>(effect: Effect<A, E>): TaskResult<A, E>;
/** Converts a Promise rejection into a typed error only through the explicit mapper. */
export declare function fromPromise<A, E>(factory: () => Promise<A>, onRejected: (reason: unknown) => E): TaskResult<A, E>;
export declare function run<A, E>(task: TaskResult<A, E>): Promise<ResultValue<A, E>>;
export declare function map<A, E, B>(task: TaskResult<A, E>, transform: (value: A) => B): TaskResult<B, E>;
export declare function mapErr<A, E, F>(task: TaskResult<A, E>, transform: (errorValue: E) => F): TaskResult<A, F>;
export declare function flatMap<A, E, B, F>(task: TaskResult<A, E>, transform: (value: A) => TaskResult<B, F>): TaskResult<B, E | F>;
export declare function recover<A, E, B>(task: TaskResult<A, E>, recovery: (errorValue: E) => B): TaskResult<A | B, never>;
export declare function orElse<A, E, B, F>(task: TaskResult<A, E>, recovery: (errorValue: E) => TaskResult<B, F>): TaskResult<A | B, F>;
export declare function tap<A, E>(task: TaskResult<A, E>, effect: (value: A) => void): TaskResult<A, E>;
export declare function tapErr<A, E>(task: TaskResult<A, E>, effect: (errorValue: E) => void): TaskResult<A, E>;
/** Starts both tasks together. Result errors prefer the left task. */
export declare function zip<A, E, B, F>(left: TaskResult<A, E>, right: TaskResult<B, F>): TaskResult<readonly [A, B], E | F>;
/** Starts every task together and returns the first Err in input order. */
export declare function all<A extends defined, E>(tasks: ReadonlyArray<TaskResult<A, E>>): TaskResult<A[], E>;
/** Retries typed Err results. `retries` counts additional attempts after the first. */
export declare function retry<A, E>(task: TaskResult<A, E>, retries: number, shouldRetry?: (errorValue: E, attempt: number) => boolean): TaskResult<A, E>;
/** Retries typed Err results after a Promise-native cancellable delay. */
export declare function retryWithDelay<A, E>(task: TaskResult<A, E>, retries: number, delaySeconds: number, shouldRetry?: (errorValue: E, attempt: number) => boolean): TaskResult<A, E>;
/**
 * Cancels the source task and resolves with a typed timeout error when the
 * deadline wins. Source rejections remain rejections.
 */
export declare function timeout<A, E, F>(task: TaskResult<A, E>, seconds: number, onTimeout: () => F): TaskResult<A, E | F>;
export declare function mapWith<A, E, B>(transform: (value: A) => B): (task: TaskResult<A, E>) => TaskResult<B, E>;
export declare function mapErrWith<A, E, F>(transform: (errorValue: E) => F): (task: TaskResult<A, E>) => TaskResult<A, F>;
export declare function flatMapWith<A, E, B, F>(transform: (value: A) => TaskResult<B, F>): (task: TaskResult<A, E>) => TaskResult<B, E | F>;
export declare function recoverWith<A, E, B>(recovery: (errorValue: E) => B): (task: TaskResult<A, E>) => TaskResult<A | B, never>;
export declare function orElseWith<A, E, B, F>(recovery: (errorValue: E) => TaskResult<B, F>): (task: TaskResult<A, E>) => TaskResult<A | B, F>;
export declare const TaskResult: {
    succeed: typeof succeed;
    fail: typeof fail;
    fromResult: typeof fromResult;
    fromEffect: typeof fromEffect;
    fromPromise: typeof fromPromise;
    run: typeof run;
    map: typeof map;
    mapErr: typeof mapErr;
    flatMap: typeof flatMap;
    recover: typeof recover;
    orElse: typeof orElse;
    tap: typeof tap;
    tapErr: typeof tapErr;
    zip: typeof zip;
    all: typeof all;
    retry: typeof retry;
    retryWithDelay: typeof retryWithDelay;
    timeout: typeof timeout;
    mapWith: typeof mapWith;
    mapErrWith: typeof mapErrWith;
    flatMapWith: typeof flatMapWith;
    recoverWith: typeof recoverWith;
    orElseWith: typeof orElseWith;
};
