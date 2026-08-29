import { type Option } from "./option";
export interface Ok<T> {
    readonly type: "ok";
    readonly value: T;
}
export interface Err<E> {
    readonly type: "err";
    readonly error: E;
}
export type Result<T, E> = Ok<T> | Err<E>;
export declare function ok<T, E = never>(value: T): Result<T, E>;
export declare function err<E, T = never>(errorValue: E): Result<T, E>;
export declare function isOk<T, E>(result: Result<T, E>): result is Ok<T>;
export declare function isErr<T, E>(result: Result<T, E>): result is Err<E>;
export declare function map<T, E, U>(result: Result<T, E>, transform: (value: T) => U): Result<U, E>;
export declare function mapErr<T, E, F>(result: Result<T, E>, transform: (error: E) => F): Result<T, F>;
export declare function flatMap<T, E, U, F>(result: Result<T, E>, transform: (value: T) => Result<U, F>): Result<U, E | F>;
export declare function flatten<T, E, F>(result: Result<Result<T, F>, E>): Result<T, E | F>;
export declare function match<T, E, U, V>(result: Result<T, E>, cases: {
    ok: (value: T) => U;
    err: (error: E) => V;
}): U | V;
export declare function unwrap<T, E>(result: Result<T, E>): T;
export declare function unwrapErr<T, E>(result: Result<T, E>): E;
export declare function expect<T, E>(result: Result<T, E>, message: string): T;
export declare function unwrapOr<T, E, U>(result: Result<T, E>, fallback: U): T | U;
export declare function unwrapOrElse<T, E, U>(result: Result<T, E>, fallback: (error: E) => U): T | U;
export declare function recover<T, E, U>(result: Result<T, E>, recovery: (error: E) => U): Result<T | U, never>;
export declare function tap<T, E>(result: Result<T, E>, effect: (value: T) => void): Result<T, E>;
export declare function tapErr<T, E>(result: Result<T, E>, effect: (error: E) => void): Result<T, E>;
/** Combines successes, preferring the left error when both inputs fail. */
export declare function zip<A, E, B, F>(left: Result<A, E>, right: Result<B, F>): Result<readonly [A, B], E | F>;
export declare function toOption<T extends defined, E>(result: Result<T, E>): Option<T>;
export declare function errorToOption<T, E extends defined>(result: Result<T, E>): Option<E>;
/** Creates a data-last success mapper for use in `pipe`. */
export declare function mapWith<T, E, U>(transform: (value: T) => U): (result: Result<T, E>) => Result<U, E>;
/** Creates a data-last error mapper for use in `pipe`. */
export declare function mapErrWith<T, E, F>(transform: (errorValue: E) => F): (result: Result<T, E>) => Result<T, F>;
/** Creates a data-last success flat-mapper while preserving both error types. */
export declare function flatMapWith<T, E, U, F>(transform: (value: T) => Result<U, F>): (result: Result<T, E>) => Result<U, E | F>;
/** Creates a data-last recovery operation for use in `pipe`. */
export declare function recoverWith<T, E, U>(recovery: (errorValue: E) => U): (result: Result<T, E>) => Result<T | U, never>;
export declare const Result: {
    ok: typeof ok;
    err: typeof err;
    isOk: typeof isOk;
    isErr: typeof isErr;
    map: typeof map;
    mapErr: typeof mapErr;
    flatMap: typeof flatMap;
    flatten: typeof flatten;
    match: typeof match;
    unwrap: typeof unwrap;
    unwrapErr: typeof unwrapErr;
    expect: typeof expect;
    unwrapOr: typeof unwrapOr;
    unwrapOrElse: typeof unwrapOrElse;
    recover: typeof recover;
    tap: typeof tap;
    tapErr: typeof tapErr;
    zip: typeof zip;
    toOption: typeof toOption;
    errorToOption: typeof errorToOption;
    mapWith: typeof mapWith;
    mapErrWith: typeof mapErrWith;
    flatMapWith: typeof flatMapWith;
    recoverWith: typeof recoverWith;
};
