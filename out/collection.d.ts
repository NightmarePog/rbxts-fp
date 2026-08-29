import { type Option } from "./option";
export declare function filterMap<T extends defined, U extends defined>(values: ReadonlyArray<T>, transform: (value: T, index: number) => Option<U>): U[];
export declare function findMap<T extends defined, U extends defined>(values: ReadonlyArray<T>, transform: (value: T, index: number) => Option<U>): Option<U>;
export declare function partition<T extends defined, U extends T>(values: ReadonlyArray<T>, predicate: (value: T) => value is U): readonly [U[], Exclude<T, U>[]];
export declare function partition<T extends defined>(values: ReadonlyArray<T>, predicate: (value: T) => boolean): readonly [T[], T[]];
export declare function groupBy<T extends defined, K extends defined>(values: ReadonlyArray<T>, keyOf: (value: T) => K): Map<K, T[]>;
/** Indexes values by key. A later value replaces an earlier duplicate key. */
export declare function keyBy<T extends defined, K extends defined>(values: ReadonlyArray<T>, keyOf: (value: T) => K): Map<K, T>;
export declare function scan<T extends defined, A extends defined>(values: ReadonlyArray<T>, initial: A, reducer: (state: A, value: T, index: number) => A): A[];
export declare function zipWith<A extends defined, B extends defined, C extends defined>(left: ReadonlyArray<A>, right: ReadonlyArray<B>, combine: (left: A, right: B, index: number) => C): C[];
/** Keeps the first value encountered for each key. */
export declare function uniqueBy<T extends defined, K extends defined>(values: ReadonlyArray<T>, keyOf: (value: T) => K): T[];
export declare function sumBy<T extends defined>(values: ReadonlyArray<T>, valueOf: (value: T) => number): number;
/** Returns the first minimum, or None when the input is empty. */
export declare function minBy<T extends defined>(values: ReadonlyArray<T>, valueOf: (value: T) => number): Option<T>;
/** Returns the first maximum, or None when the input is empty. */
export declare function maxBy<T extends defined>(values: ReadonlyArray<T>, valueOf: (value: T) => number): Option<T>;
export declare function filterMapWith<T extends defined, U extends defined>(transform: (value: T, index: number) => Option<U>): (values: ReadonlyArray<T>) => U[];
export declare function findMapWith<T extends defined, U extends defined>(transform: (value: T, index: number) => Option<U>): (values: ReadonlyArray<T>) => Option<U>;
export declare function partitionWith<T extends defined, U extends T>(predicate: (value: T) => value is U): (values: ReadonlyArray<T>) => readonly [U[], Exclude<T, U>[]];
export declare function partitionWith<T extends defined>(predicate: (value: T) => boolean): (values: ReadonlyArray<T>) => readonly [T[], T[]];
export declare function groupByWith<T extends defined, K extends defined>(keyOf: (value: T) => K): (values: ReadonlyArray<T>) => Map<K, T[]>;
export declare function keyByWith<T extends defined, K extends defined>(keyOf: (value: T) => K): (values: ReadonlyArray<T>) => Map<K, T>;
export declare function scanWith<T extends defined, A extends defined>(initial: A, reducer: (state: A, value: T, index: number) => A): (values: ReadonlyArray<T>) => A[];
export declare function zipWithRight<A extends defined, B extends defined, C extends defined>(right: ReadonlyArray<B>, combine: (left: A, right: B, index: number) => C): (left: ReadonlyArray<A>) => C[];
export declare function uniqueByWith<T extends defined, K extends defined>(keyOf: (value: T) => K): (values: ReadonlyArray<T>) => T[];
export declare function sumByWith<T extends defined>(valueOf: (value: T) => number): (values: ReadonlyArray<T>) => number;
export declare function minByWith<T extends defined>(valueOf: (value: T) => number): (values: ReadonlyArray<T>) => Option<T>;
export declare function maxByWith<T extends defined>(valueOf: (value: T) => number): (values: ReadonlyArray<T>) => Option<T>;
/** Data-last collection operations intended for use in `pipe`. */
export declare const Collection: {
    filterMap: typeof filterMapWith;
    findMap: typeof findMapWith;
    partition: typeof partitionWith;
    groupBy: typeof groupByWith;
    keyBy: typeof keyByWith;
    scan: typeof scanWith;
    zipWith: typeof zipWithRight;
    uniqueBy: typeof uniqueByWith;
    sumBy: typeof sumByWith;
    minBy: typeof minByWith;
    maxBy: typeof maxByWith;
};
