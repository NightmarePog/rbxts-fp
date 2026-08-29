import { type Result as ResultValue } from "./result";
/** A cold synchronous operation with a typed expected-failure channel. */
export type Effect<A, E> = () => ResultValue<A, E>;
export declare function succeed<A, E = never>(value: A): Effect<A, E>;
export declare function fail<E, A = never>(errorValue: E): Effect<A, E>;
export declare function fromResult<A, E>(result: ResultValue<A, E>): Effect<A, E>;
/** Defers synchronous work. Thrown errors remain defects and are not typed failures. */
export declare function sync<A>(evaluate: () => A): Effect<A, never>;
/** Defers synchronous work and explicitly maps a thrown value into the typed error channel. */
export declare function tryEffect<A, E>(evaluate: () => A, onThrow: (reason: unknown) => E): Effect<A, E>;
/** Defers a function that already describes expected failure with Result. */
export declare function tryResult<A, E>(evaluate: () => ResultValue<A, E>): Effect<A, E>;
/** Defers construction of another Effect, useful for recursion and conditional programs. */
export declare function suspend<A, E>(evaluate: () => Effect<A, E>): Effect<A, E>;
export declare function run<A, E>(effect: Effect<A, E>): ResultValue<A, E>;
export declare function map<A, E, B>(effect: Effect<A, E>, transform: (value: A) => B): Effect<B, E>;
export declare function mapErr<A, E, F>(effect: Effect<A, E>, transform: (errorValue: E) => F): Effect<A, F>;
export declare function flatMap<A, E, B, F>(effect: Effect<A, E>, transform: (value: A) => Effect<B, F>): Effect<B, E | F>;
export declare function recover<A, E, B>(effect: Effect<A, E>, recovery: (errorValue: E) => B): Effect<A | B, never>;
export declare function orElse<A, E, B, F>(effect: Effect<A, E>, recovery: (errorValue: E) => Effect<B, F>): Effect<A | B, F>;
export declare function tap<A, E>(effect: Effect<A, E>, observe: (value: A) => void): Effect<A, E>;
export declare function tapErr<A, E>(effect: Effect<A, E>, observe: (errorValue: E) => void): Effect<A, E>;
/** Runs left-to-right and stops before running the right Effect when the left fails. */
export declare function zip<A, E, B, F>(left: Effect<A, E>, right: Effect<B, F>): Effect<readonly [A, B], E | F>;
/** Runs left-to-right and stops at the first Err. */
export declare function all<A extends defined, E>(effects: ReadonlyArray<Effect<A, E>>): Effect<A[], E>;
/** Runs a finalizer after success, typed failure, or a thrown defect. */
export declare function ensuring<A, E>(effect: Effect<A, E>, finalizer: Effect<void, never>): Effect<A, E>;
/** Acquires a resource, uses it, and always finalizes it after successful acquisition. */
export declare function acquireUseRelease<Resource, AcquireError, A, UseError>(acquire: Effect<Resource, AcquireError>, use: (resource: Resource) => Effect<A, UseError>, release: (resource: Resource) => Effect<void, never>): Effect<A, AcquireError | UseError>;
export declare function lift<Arguments extends unknown[], A>(operation: (...arguments_: Arguments) => A): (...arguments_: Arguments) => Effect<A, never>;
export declare function liftResult<Arguments extends unknown[], A, E>(operation: (...arguments_: Arguments) => ResultValue<A, E>): (...arguments_: Arguments) => Effect<A, E>;
export declare function mapWith<A, E, B>(transform: (value: A) => B): (effect: Effect<A, E>) => Effect<B, E>;
export declare function mapErrWith<A, E, F>(transform: (errorValue: E) => F): (effect: Effect<A, E>) => Effect<A, F>;
export declare function flatMapWith<A, E, B, F>(transform: (value: A) => Effect<B, F>): (effect: Effect<A, E>) => Effect<B, E | F>;
export declare function recoverWith<A, E, B>(recovery: (errorValue: E) => B): (effect: Effect<A, E>) => Effect<A | B, never>;
export declare function orElseWith<A, E, B, F>(recovery: (errorValue: E) => Effect<B, F>): (effect: Effect<A, E>) => Effect<A | B, F>;
export declare const Effect: {
    succeed: typeof succeed;
    fail: typeof fail;
    fromResult: typeof fromResult;
    sync: typeof sync;
    try: typeof tryEffect;
    tryResult: typeof tryResult;
    suspend: typeof suspend;
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
    ensuring: typeof ensuring;
    acquireUseRelease: typeof acquireUseRelease;
    lift: typeof lift;
    liftResult: typeof liftResult;
    mapWith: typeof mapWith;
    mapErrWith: typeof mapErrWith;
    flatMapWith: typeof flatMapWith;
    recoverWith: typeof recoverWith;
    orElseWith: typeof orElseWith;
};
