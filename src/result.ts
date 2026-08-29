import { none, some, type Option } from "@/option";

export interface Ok<T> {
	readonly type: "ok";
	readonly value: T;
}

export interface Err<E> {
	readonly type: "err";
	readonly error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T, E = never>(value: T): Result<T, E> {
	return { type: "ok", value };
}

export function err<E, T = never>(errorValue: E): Result<T, E> {
	return { type: "err", error: errorValue };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
	return result.type === "ok";
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
	return result.type === "err";
}

export function map<T, E, U>(result: Result<T, E>, transform: (value: T) => U): Result<U, E> {
	return result.type === "ok" ? ok(transform(result.value)) : result;
}

export function mapErr<T, E, F>(result: Result<T, E>, transform: (error: E) => F): Result<T, F> {
	return result.type === "err" ? err(transform(result.error)) : result;
}

export function flatMap<T, E, U, F>(result: Result<T, E>, transform: (value: T) => Result<U, F>): Result<U, E | F> {
	return result.type === "ok" ? transform(result.value) : result;
}

export function flatten<T, E, F>(result: Result<Result<T, F>, E>): Result<T, E | F> {
	return result.type === "ok" ? result.value : result;
}

export function match<T, E, U, V>(result: Result<T, E>, cases: { ok: (value: T) => U; err: (error: E) => V }): U | V {
	return result.type === "ok" ? cases.ok(result.value) : cases.err(result.error);
}

export function unwrap<T, E>(result: Result<T, E>): T {
	if (result.type === "err") throw `Tried to unwrap Err: ${tostring(result.error)}`;
	return result.value;
}

export function unwrapErr<T, E>(result: Result<T, E>): E {
	if (result.type === "ok") throw "Tried to unwrapErr Ok";
	return result.error;
}

export function expect<T, E>(result: Result<T, E>, message: string): T {
	assert(result.type === "ok", message);
	return result.value;
}

export function unwrapOr<T, E, U>(result: Result<T, E>, fallback: U): T | U {
	return result.type === "ok" ? result.value : fallback;
}

export function unwrapOrElse<T, E, U>(result: Result<T, E>, fallback: (error: E) => U): T | U {
	return result.type === "ok" ? result.value : fallback(result.error);
}

export function recover<T, E, U>(result: Result<T, E>, recovery: (error: E) => U): Result<T | U, never> {
	return result.type === "ok" ? result : ok(recovery(result.error));
}

export function tap<T, E>(result: Result<T, E>, effect: (value: T) => void): Result<T, E> {
	if (result.type === "ok") effect(result.value);
	return result;
}

export function tapErr<T, E>(result: Result<T, E>, effect: (error: E) => void): Result<T, E> {
	if (result.type === "err") effect(result.error);
	return result;
}

/** Combines successes, preferring the left error when both inputs fail. */
export function zip<A, E, B, F>(left: Result<A, E>, right: Result<B, F>): Result<readonly [A, B], E | F> {
	if (left.type === "err") return left;
	if (right.type === "err") return right;
	return ok([left.value, right.value] as const);
}

export function toOption<T extends defined, E>(result: Result<T, E>): Option<T> {
	return result.type === "ok" ? some(result.value) : none();
}

export function errorToOption<T, E extends defined>(result: Result<T, E>): Option<E> {
	return result.type === "err" ? some(result.error) : none();
}

/** Creates a data-last success mapper for use in `pipe`. */
export function mapWith<T, E, U>(transform: (value: T) => U): (result: Result<T, E>) => Result<U, E> {
	return (result) => map(result, transform);
}

/** Creates a data-last error mapper for use in `pipe`. */
export function mapErrWith<T, E, F>(transform: (errorValue: E) => F): (result: Result<T, E>) => Result<T, F> {
	return (result) => mapErr(result, transform);
}

/** Creates a data-last success flat-mapper while preserving both error types. */
export function flatMapWith<T, E, U, F>(
	transform: (value: T) => Result<U, F>,
): (result: Result<T, E>) => Result<U, E | F> {
	return (result) => flatMap(result, transform);
}

/** Creates a data-last recovery operation for use in `pipe`. */
export function recoverWith<T, E, U>(recovery: (errorValue: E) => U): (result: Result<T, E>) => Result<T | U, never> {
	return (result) => recover(result, recovery);
}

export const Result = {
	ok,
	err,
	isOk,
	isErr,
	map,
	mapErr,
	flatMap,
	flatten,
	match,
	unwrap,
	unwrapErr,
	expect,
	unwrapOr,
	unwrapOrElse,
	recover,
	tap,
	tapErr,
	zip,
	toOption,
	errorToOption,
	mapWith,
	mapErrWith,
	flatMapWith,
	recoverWith,
};
