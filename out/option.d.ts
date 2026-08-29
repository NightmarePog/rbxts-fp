import type { Result } from "./result";
export interface Some<T extends defined> {
    readonly type: "some";
    readonly value: T;
}
export interface None {
    readonly type: "none";
}
export type Option<T extends defined> = Some<T> | None;
export declare function some<T extends defined>(value: T): Some<T>;
export declare function none<T extends defined = never>(): Option<T>;
export declare function isSome<T extends defined>(option: Option<T>): option is Some<T>;
export declare function isNone<T extends defined>(option: Option<T>): option is None;
export declare function map<T extends defined, U extends defined>(option: Option<T>, transform: (value: T) => U): Option<U>;
export declare function flatMap<T extends defined, U extends defined>(option: Option<T>, transform: (value: T) => Option<U>): Option<U>;
export declare function flatten<T extends defined>(option: Option<Option<T>>): Option<T>;
export declare function filter<T extends defined, U extends T>(option: Option<T>, predicate: (value: T) => value is U): Option<U>;
export declare function filter<T extends defined>(option: Option<T>, predicate: (value: T) => boolean): Option<T>;
export declare function match<T extends defined, U, V>(option: Option<T>, cases: {
    some: (value: T) => U;
    none: () => V;
}): U | V;
export declare function unwrap<T extends defined>(option: Option<T>): T;
export declare function expect<T extends defined>(option: Option<T>, message: string): T;
export declare function unwrapOr<T extends defined, U>(option: Option<T>, fallback: U): T | U;
export declare function unwrapOrElse<T extends defined, U>(option: Option<T>, fallback: () => U): T | U;
export declare function tap<T extends defined>(option: Option<T>, effect: (value: T) => void): Option<T>;
export declare function zip<A extends defined, B extends defined>(left: Option<A>, right: Option<B>): Option<readonly [A, B]>;
export declare function fromNullable<T extends defined>(value: T | undefined): Option<T>;
/** Luau has one absence value (`nil`), represented by `undefined` in roblox-ts. */
export declare function toNullable<T extends defined>(option: Option<T>): T | undefined;
export declare const toUndefined: typeof toNullable;
export declare function okOr<T extends defined, E>(option: Option<T>, errorValue: E): Result<T, E>;
export declare function okOrElse<T extends defined, E>(option: Option<T>, createError: () => E): Result<T, E>;
/** Creates a data-last Option mapper for use in `pipe`. */
export declare function mapWith<T extends defined, U extends defined>(transform: (value: T) => U): (option: Option<T>) => Option<U>;
/** Creates a data-last Option flat-mapper for use in `pipe`. */
export declare function flatMapWith<T extends defined, U extends defined>(transform: (value: T) => Option<U>): (option: Option<T>) => Option<U>;
export declare function filterWith<T extends defined, U extends T>(predicate: (value: T) => value is U): (option: Option<T>) => Option<U>;
export declare function filterWith<T extends defined>(predicate: (value: T) => boolean): (option: Option<T>) => Option<T>;
/** Creates a data-last Option side effect for use in `pipe`. */
export declare function tapWith<T extends defined>(effect: (value: T) => void): (option: Option<T>) => Option<T>;
export declare const Option: {
    some: typeof some;
    none: typeof none;
    fromNullable: typeof fromNullable;
    isSome: typeof isSome;
    isNone: typeof isNone;
    map: typeof map;
    flatMap: typeof flatMap;
    flatten: typeof flatten;
    filter: typeof filter;
    match: typeof match;
    unwrap: typeof unwrap;
    expect: typeof expect;
    unwrapOr: typeof unwrapOr;
    unwrapOrElse: typeof unwrapOrElse;
    tap: typeof tap;
    zip: typeof zip;
    toNullable: typeof toNullable;
    toUndefined: typeof toNullable;
    okOr: typeof okOr;
    okOrElse: typeof okOrElse;
    mapWith: typeof mapWith;
    flatMapWith: typeof flatMapWith;
    filterWith: typeof filterWith;
    tapWith: typeof tapWith;
};
