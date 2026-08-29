export type Predicate<T> = (value: T) => boolean;
export type Refinement<A, B extends A> = (value: A) => value is B;
export declare function andPredicate<A, B extends A, C extends B>(left: Refinement<A, B>, right: Refinement<B, C>): Refinement<A, C>;
export declare function andPredicate<T>(left: Predicate<T>, right: Predicate<T>): Predicate<T>;
export declare function orPredicate<A, B extends A, C extends A>(left: Refinement<A, B>, right: Refinement<A, C>): Refinement<A, B | C>;
export declare function orPredicate<T>(left: Predicate<T>, right: Predicate<T>): Predicate<T>;
export declare function notPredicate<A, B extends A>(predicate: Refinement<A, B>): Refinement<A, Exclude<A, B>>;
export declare function notPredicate<T>(predicate: Predicate<T>): Predicate<T>;
export declare function all<T>(...predicates: Array<Predicate<T>>): Predicate<T>;
export declare function any<T>(...predicates: Array<Predicate<T>>): Predicate<T>;
/** Luau keywords are exposed as properties, so `Predicate.and` compiles cleanly. */
export declare const Predicate: {
    and: typeof andPredicate;
    or: typeof orPredicate;
    not: typeof notPredicate;
    all: typeof all;
    any: typeof any;
};
