import type { Result } from "@/result";

export interface Some<T extends defined> {
	readonly type: "some";
	readonly value: T;
}

export interface None {
	readonly type: "none";
}

export type Option<T extends defined> = Some<T> | None;

const NONE: None = { type: "none" };

export function some<T extends defined>(value: T): Some<T> {
	return { type: "some", value };
}

export function none<T extends defined = never>(): Option<T> {
	return NONE;
}

export function isSome<T extends defined>(option: Option<T>): option is Some<T> {
	return option.type === "some";
}

export function isNone<T extends defined>(option: Option<T>): option is None {
	return option.type === "none";
}

export function map<T extends defined, U extends defined>(option: Option<T>, transform: (value: T) => U): Option<U> {
	return option.type === "some" ? some(transform(option.value)) : NONE;
}

export function flatMap<T extends defined, U extends defined>(
	option: Option<T>,
	transform: (value: T) => Option<U>,
): Option<U> {
	return option.type === "some" ? transform(option.value) : NONE;
}

export function flatten<T extends defined>(option: Option<Option<T>>): Option<T> {
	return option.type === "some" ? option.value : NONE;
}

export function filter<T extends defined, U extends T>(
	option: Option<T>,
	predicate: (value: T) => value is U,
): Option<U>;
export function filter<T extends defined>(option: Option<T>, predicate: (value: T) => boolean): Option<T>;
export function filter<T extends defined>(option: Option<T>, predicate: (value: T) => boolean): Option<T> {
	return option.type === "some" && predicate(option.value) ? option : NONE;
}

export function match<T extends defined, U, V>(
	option: Option<T>,
	cases: { some: (value: T) => U; none: () => V },
): U | V {
	return option.type === "some" ? cases.some(option.value) : cases.none();
}

export function unwrap<T extends defined>(option: Option<T>): T {
	assert(option.type === "some", "Tried to unwrap None");
	return option.value;
}

export function expect<T extends defined>(option: Option<T>, message: string): T {
	assert(option.type === "some", message);
	return option.value;
}

export function unwrapOr<T extends defined, U>(option: Option<T>, fallback: U): T | U {
	return option.type === "some" ? option.value : fallback;
}

export function unwrapOrElse<T extends defined, U>(option: Option<T>, fallback: () => U): T | U {
	return option.type === "some" ? option.value : fallback();
}

export function tap<T extends defined>(option: Option<T>, effect: (value: T) => void): Option<T> {
	if (option.type === "some") effect(option.value);
	return option;
}

export function zip<A extends defined, B extends defined>(left: Option<A>, right: Option<B>): Option<readonly [A, B]> {
	return left.type === "some" && right.type === "some" ? some([left.value, right.value] as const) : NONE;
}

export function fromNullable<T extends defined>(value: T | undefined): Option<T> {
	return value === undefined ? NONE : some(value);
}

/** Luau has one absence value (`nil`), represented by `undefined` in roblox-ts. */
export function toNullable<T extends defined>(option: Option<T>): T | undefined {
	return option.type === "some" ? option.value : undefined;
}

export const toUndefined = toNullable;

export function okOr<T extends defined, E>(option: Option<T>, errorValue: E): Result<T, E> {
	return option.type === "some" ? { type: "ok", value: option.value } : { type: "err", error: errorValue };
}

export function okOrElse<T extends defined, E>(option: Option<T>, createError: () => E): Result<T, E> {
	return option.type === "some" ? { type: "ok", value: option.value } : { type: "err", error: createError() };
}

/** Creates a data-last Option mapper for use in `pipe`. */
export function mapWith<T extends defined, U extends defined>(
	transform: (value: T) => U,
): (option: Option<T>) => Option<U> {
	return (option) => map(option, transform);
}

/** Creates a data-last Option flat-mapper for use in `pipe`. */
export function flatMapWith<T extends defined, U extends defined>(
	transform: (value: T) => Option<U>,
): (option: Option<T>) => Option<U> {
	return (option) => flatMap(option, transform);
}

export function filterWith<T extends defined, U extends T>(
	predicate: (value: T) => value is U,
): (option: Option<T>) => Option<U>;
export function filterWith<T extends defined>(predicate: (value: T) => boolean): (option: Option<T>) => Option<T>;
export function filterWith<T extends defined>(predicate: (value: T) => boolean): (option: Option<T>) => Option<T> {
	return (option) => filter(option, predicate);
}

/** Creates a data-last Option side effect for use in `pipe`. */
export function tapWith<T extends defined>(effect: (value: T) => void): (option: Option<T>) => Option<T> {
	return (option) => tap(option, effect);
}

export const Option = {
	some,
	none,
	fromNullable,
	isSome,
	isNone,
	map,
	flatMap,
	flatten,
	filter,
	match,
	unwrap,
	expect,
	unwrapOr,
	unwrapOrElse,
	tap,
	zip,
	toNullable,
	toUndefined,
	okOr,
	okOrElse,
	mapWith,
	flatMapWith,
	filterWith,
	tapWith,
};
