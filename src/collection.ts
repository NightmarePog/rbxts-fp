import { none, some, type Option } from "@/option";

export function filterMap<T extends defined, U extends defined>(
	values: ReadonlyArray<T>,
	transform: (value: T, index: number) => Option<U>,
): U[] {
	const output = new Array<U>();
	for (let index = 0; index < values.size(); index++) {
		const transformed = transform(values[index], index);
		if (transformed.type === "some") output.push(transformed.value);
	}
	return output;
}

export function findMap<T extends defined, U extends defined>(
	values: ReadonlyArray<T>,
	transform: (value: T, index: number) => Option<U>,
): Option<U> {
	for (let index = 0; index < values.size(); index++) {
		const transformed = transform(values[index], index);
		if (transformed.type === "some") return transformed;
	}
	return none();
}

export function partition<T extends defined, U extends T>(
	values: ReadonlyArray<T>,
	predicate: (value: T) => value is U,
): readonly [U[], Exclude<T, U>[]];
export function partition<T extends defined>(
	values: ReadonlyArray<T>,
	predicate: (value: T) => boolean,
): readonly [T[], T[]];
export function partition<T extends defined>(
	values: ReadonlyArray<T>,
	predicate: (value: T) => boolean,
): readonly [T[], T[]] {
	const matched = new Array<T>();
	const unmatched = new Array<T>();
	for (const value of values) (predicate(value) ? matched : unmatched).push(value);
	return [matched, unmatched] as const;
}

export function groupBy<T extends defined, K extends defined>(
	values: ReadonlyArray<T>,
	keyOf: (value: T) => K,
): Map<K, T[]> {
	const groups = new Map<K, T[]>();
	for (const value of values) {
		const key = keyOf(value);
		const group = groups.get(key);
		if (group !== undefined) group.push(value);
		else groups.set(key, [value]);
	}
	return groups;
}

/** Indexes values by key. A later value replaces an earlier duplicate key. */
export function keyBy<T extends defined, K extends defined>(
	values: ReadonlyArray<T>,
	keyOf: (value: T) => K,
): Map<K, T> {
	const keyed = new Map<K, T>();
	for (const value of values) keyed.set(keyOf(value), value);
	return keyed;
}

export function scan<T extends defined, A extends defined>(
	values: ReadonlyArray<T>,
	initial: A,
	reducer: (state: A, value: T, index: number) => A,
): A[] {
	const states = new Array<A>();
	let state = initial;
	for (let index = 0; index < values.size(); index++) {
		state = reducer(state, values[index], index);
		states.push(state);
	}
	return states;
}

export function zipWith<A extends defined, B extends defined, C extends defined>(
	left: ReadonlyArray<A>,
	right: ReadonlyArray<B>,
	combine: (left: A, right: B, index: number) => C,
): C[] {
	const length = math.min(left.size(), right.size());
	const output = new Array<C>();
	for (let index = 0; index < length; index++) output.push(combine(left[index], right[index], index));
	return output;
}

/** Keeps the first value encountered for each key. */
export function uniqueBy<T extends defined, K extends defined>(values: ReadonlyArray<T>, keyOf: (value: T) => K): T[] {
	const seen = new Set<K>();
	const output = new Array<T>();
	for (const value of values) {
		const key = keyOf(value);
		if (!seen.has(key)) {
			seen.add(key);
			output.push(value);
		}
	}
	return output;
}

export function sumBy<T extends defined>(values: ReadonlyArray<T>, valueOf: (value: T) => number): number {
	let total = 0;
	for (const value of values) total += valueOf(value);
	return total;
}

/** Returns the first minimum, or None when the input is empty. */
export function minBy<T extends defined>(values: ReadonlyArray<T>, valueOf: (value: T) => number): Option<T> {
	if (values.isEmpty()) return none();
	let best = values[0];
	let bestValue = valueOf(best);
	for (let index = 1; index < values.size(); index++) {
		const candidate = values[index];
		const candidateValue = valueOf(candidate);
		if (candidateValue < bestValue) {
			best = candidate;
			bestValue = candidateValue;
		}
	}
	return some(best);
}

/** Returns the first maximum, or None when the input is empty. */
export function maxBy<T extends defined>(values: ReadonlyArray<T>, valueOf: (value: T) => number): Option<T> {
	if (values.isEmpty()) return none();
	let best = values[0];
	let bestValue = valueOf(best);
	for (let index = 1; index < values.size(); index++) {
		const candidate = values[index];
		const candidateValue = valueOf(candidate);
		if (candidateValue > bestValue) {
			best = candidate;
			bestValue = candidateValue;
		}
	}
	return some(best);
}

export function filterMapWith<T extends defined, U extends defined>(
	transform: (value: T, index: number) => Option<U>,
): (values: ReadonlyArray<T>) => U[] {
	return (values) => filterMap(values, transform);
}

export function findMapWith<T extends defined, U extends defined>(
	transform: (value: T, index: number) => Option<U>,
): (values: ReadonlyArray<T>) => Option<U> {
	return (values) => findMap(values, transform);
}

export function partitionWith<T extends defined, U extends T>(
	predicate: (value: T) => value is U,
): (values: ReadonlyArray<T>) => readonly [U[], Exclude<T, U>[]];
export function partitionWith<T extends defined>(
	predicate: (value: T) => boolean,
): (values: ReadonlyArray<T>) => readonly [T[], T[]];
export function partitionWith<T extends defined>(
	predicate: (value: T) => boolean,
): (values: ReadonlyArray<T>) => readonly [T[], T[]] {
	return (values) => partition(values, predicate);
}

export function groupByWith<T extends defined, K extends defined>(
	keyOf: (value: T) => K,
): (values: ReadonlyArray<T>) => Map<K, T[]> {
	return (values) => groupBy(values, keyOf);
}

export function keyByWith<T extends defined, K extends defined>(
	keyOf: (value: T) => K,
): (values: ReadonlyArray<T>) => Map<K, T> {
	return (values) => keyBy(values, keyOf);
}

export function scanWith<T extends defined, A extends defined>(
	initial: A,
	reducer: (state: A, value: T, index: number) => A,
): (values: ReadonlyArray<T>) => A[] {
	return (values) => scan(values, initial, reducer);
}

export function zipWithRight<A extends defined, B extends defined, C extends defined>(
	right: ReadonlyArray<B>,
	combine: (left: A, right: B, index: number) => C,
): (left: ReadonlyArray<A>) => C[] {
	return (left) => zipWith(left, right, combine);
}

export function uniqueByWith<T extends defined, K extends defined>(
	keyOf: (value: T) => K,
): (values: ReadonlyArray<T>) => T[] {
	return (values) => uniqueBy(values, keyOf);
}

export function sumByWith<T extends defined>(valueOf: (value: T) => number): (values: ReadonlyArray<T>) => number {
	return (values) => sumBy(values, valueOf);
}

export function minByWith<T extends defined>(valueOf: (value: T) => number): (values: ReadonlyArray<T>) => Option<T> {
	return (values) => minBy(values, valueOf);
}

export function maxByWith<T extends defined>(valueOf: (value: T) => number): (values: ReadonlyArray<T>) => Option<T> {
	return (values) => maxBy(values, valueOf);
}

/** Data-last collection operations intended for use in `pipe`. */
export const Collection = {
	filterMap: filterMapWith,
	findMap: findMapWith,
	partition: partitionWith,
	groupBy: groupByWith,
	keyBy: keyByWith,
	scan: scanWith,
	zipWith: zipWithRight,
	uniqueBy: uniqueByWith,
	sumBy: sumByWith,
	minBy: minByWith,
	maxBy: maxByWith,
};
