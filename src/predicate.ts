export type Predicate<T> = (value: T) => boolean;
export type Refinement<A, B extends A> = (value: A) => value is B;

export function andPredicate<A, B extends A, C extends B>(
	left: Refinement<A, B>,
	right: Refinement<B, C>,
): Refinement<A, C>;
export function andPredicate<T>(left: Predicate<T>, right: Predicate<T>): Predicate<T>;
export function andPredicate<T>(left: Predicate<T>, right: Predicate<T>): Predicate<T> {
	return (value) => left(value) && right(value);
}

export function orPredicate<A, B extends A, C extends A>(
	left: Refinement<A, B>,
	right: Refinement<A, C>,
): Refinement<A, B | C>;
export function orPredicate<T>(left: Predicate<T>, right: Predicate<T>): Predicate<T>;
export function orPredicate<T>(left: Predicate<T>, right: Predicate<T>): Predicate<T> {
	return (value) => left(value) || right(value);
}

export function notPredicate<A, B extends A>(predicate: Refinement<A, B>): Refinement<A, Exclude<A, B>>;
export function notPredicate<T>(predicate: Predicate<T>): Predicate<T>;
export function notPredicate<T>(predicate: Predicate<T>): Predicate<T> {
	return (value) => !predicate(value);
}

export function all<T>(...predicates: Array<Predicate<T>>): Predicate<T> {
	return (value) => {
		for (const predicate of predicates) if (!predicate(value)) return false;
		return true;
	};
}

export function any<T>(...predicates: Array<Predicate<T>>): Predicate<T> {
	return (value) => {
		for (const predicate of predicates) if (predicate(value)) return true;
		return false;
	};
}

/** Luau keywords are exposed as properties, so `Predicate.and` compiles cleanly. */
export const Predicate = {
	and: andPredicate,
	or: orPredicate,
	not: notPredicate,
	all,
	any,
};
