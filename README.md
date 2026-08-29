# @rbxts/fp

Small functional building blocks designed for roblox-ts and Luau. The package favors tagged values and ordinary functions over classes, method wrappers, and runtime type machinery.

Public operations are pure unless their name explicitly describes an effect (`tap`, `connect`, or `connectionCleanup`). Implementations use local mutation and direct loops where that avoids intermediate tables or callback closures; inputs are never mutated.

## Why this package is small

roblox-ts already compiles array operations such as `map`, `filter`, `mapFiltered`, `find`, and `reduce` directly to efficient Luau. Its Promise implementation already provides cancellation and cleanup hooks. Sift, Maid, and observer packages cover larger immutable-collection and lifecycle needs. `@rbxts/fp` does not duplicate them.

The package provides:

-   `Option` for a value that may be absent;
-   `Result` for an expected, typed failure;
-   `Effect` for cold synchronous work and controlled mutation;
-   `TaskResult` for cold Promise work with an expected, typed failure;
-   exhaustive dispatch for `{ type: "..." }` unions;
-   `pipe`, `flow`, `compose`, `identity`, `constant`, and `tap`;
-   typed predicate combinators;
-   fused or absence-aware collection helpers;
-   cleanup-function adapters for Roblox signals.

It deliberately does not provide a fiber scheduler, dependency container, or second cancellation system. `Effect` supplies explicit synchronous boundaries and finalization; `TaskResult` composes roblox-ts Promise for asynchronous work. Flamework, Maid, and Roblox retain their existing responsibilities.

## Option instead of repeated undefined checks

```ts
import { Option } from "@rbxts/fp";

const humanoid = Option.fromNullable(character.FindFirstChildOfClass("Humanoid"));
const health = Option.map(humanoid, (value) => value.Health);

print(Option.unwrapOr(health, 0));
```

`None` is a shared singleton. Transforming `None` does not allocate another table.

`Option` cannot contain `undefined`, because `undefined` is Luau `nil`. Use `Option.fromNullable` at an optional-value boundary.

## Result instead of throwing for expected failures

```ts
import { Result } from "@rbxts/fp";

type BoardError = "not-a-driver" | "train-full";

function boardTrain(player: Player): Result<Seat, BoardError> {
	if (!isDriver(player)) return Result.err("not-a-driver");
	const seat = findFreeSeat();
	return seat ? Result.ok(seat) : Result.err("train-full");
}

const message = Result.match(boardTrain(player), {
	ok: (seat) => `Boarded ${seat.Name}`,
	err: (reason) => `Could not board: ${reason}`,
});
```

`Result.flatMap` preserves both error types as a union.

`unwrap` and `expect` throw and are intended for violated invariants, not expected failures. `unwrapOrElse`, `okOrElse`, and `recover` evaluate their callbacks only when the fallback or recovery is needed. `Result.zip` returns the left error first, then the right error.

## Controlled synchronous effects

`Effect<A, E>` is a cold `() => Result<A, E>`. Constructing one describes synchronous work without running it. `Effect.run` is the explicit boundary where mutation occurs.

```ts
import make from "@rbxts/instance-factory";
import { Effect, Result, type Effect as SyncEffect } from "@rbxts/fp";
import { Workspace } from "@rbxts/services";

function createSignal(): SyncEffect<Part, never> {
	return Effect.sync(() =>
		make<Part>(
			{
				Name: "Signal",
				Anchored: true,
				Size: new Vector3(1, 4, 1),
			},
			Workspace,
		),
	);
}

// No Instance exists before this boundary.
const signal = Result.unwrap(Effect.run(createSignal()));
```

Keep the `make<Part>(...)` call directly inside `Effect.sync`. The instance-factory transformer intentionally does not transform calls forwarded through another variable, so `Effect.lift(make)` is not supported. `Effect.lift` remains useful for ordinary non-transformed functions.

`Effect.sync` leaves thrown errors as defects. Convert a genuinely expected thrown value only with an explicit mapper:

```ts
const readAttribute = Effect.try(
	() => decodeAttribute(instance.GetAttribute("Configuration")),
	(reason) => ({ type: "invalid-configuration" as const, reason: tostring(reason) }),
);
```

Use `acquireUseRelease` when synchronous ownership must be guaranteed:

```ts
const program = Effect.acquireUseRelease(
	createSignal(),
	(signal) => Effect.sync(() => configureSignal(signal)),
	(signal) => Effect.sync(() => signal.Destroy()),
);
```

The release Effect runs after success, typed failure, or a thrown defect. It does not run when acquisition returns Err because no resource was acquired.

## Typed asynchronous work

`TaskResult<A, E>` is a cold `() => Promise<Result<A, E>>`. Calling it starts the operation. This makes retrying and composing work predictable while retaining native Promise cancellation.

```ts
import { TaskResult, pipe, type TaskResult as Task } from "@rbxts/fp";

type LoadError = { readonly type: "missing" } | { readonly type: "offline" };

function loadTrain(id: string): Task<Train, LoadError> {
	return TaskResult.fromPromise(
		() => trainStore.load(id),
		() => ({ type: "offline" }),
	);
}

const loadName = pipe(
	loadTrain(trainId),
	TaskResult.mapWith((train: Train) => train.Name),
	(task) => TaskResult.timeout(task, 5, () => ({ type: "offline" as const })),
);

const result = await TaskResult.run(loadName);
```

Expected failures resolve as `Err<E>`. Unexpected failures remain Promise rejections unless explicitly converted with `fromPromise`. Cancelling the returned Promise cancels its active chain; `timeout` also cancels the source when its deadline wins.

Flamework dependencies stay in Flamework. Capture injected services in the task closure instead of building a second environment system:

```ts
@Service({})
export class TrainLoader {
	public constructor(private readonly store: TrainStore) {}

	public load(id: string): Task<Train, LoadError> {
		return () => this.store.load(id);
	}
}
```

For Maid ownership, start the task and register its native cancellation:

```ts
const promise = TaskResult.run(loader.load(trainId));
maid.GiveTask(() => promise.cancel());
```

## Exhaustive domain-state handling

```ts
import { match } from "@rbxts/fp";

type TrainState =
	| { readonly type: "idle" }
	| { readonly type: "moving"; readonly speed: number }
	| { readonly type: "braking"; readonly force: number };

const label = match(state, {
	idle: () => "Stopped",
	moving: ({ speed }) => `Moving at ${speed}`,
	braking: ({ force }) => `Braking at ${force}`,
});
```

Adding a new state produces a type error at every match that has not handled it. The runtime is one table lookup and one function call; there is no builder object or pattern engine.

## Composition and fused collections

```ts
import { Collection, Option, pipe } from "@rbxts/fp";

const activeSpeeds = pipe(
	trains,
	Collection.filterMap((train: Train) => (train.active ? Option.some(train.speed) : Option.none())),
	(values) => values.reduce((total, speed) => total + speed, 0),
);
```

Prefer built-in array methods for ordinary transformations. Use `filterMap` and `findMap` when they fuse filtering with transformation or make absence explicit.

Direct operations are data-first and avoid adapter allocations:

```ts
const speed = Option.map(possibleTrain, (train) => train.speed);
```

The `Option.*With`, `Result.*With`, and `Collection` APIs create data-last functions for pipelines:

```ts
const label = pipe(
	possibleTrain,
	Option.filterWith((train: Train) => train.active),
	Option.mapWith((train: Train) => train.Name),
);
```

Creating an adapter allocates one closure. Reusing the adapter avoids repeated allocation in hot paths.

## Collection contracts

-   `filterMap`, `findMap`, `partition`, `scan`, and `zipWith` preserve input order.
-   `zipWith` stops at the shorter input.
-   `keyBy` keeps the last value for a duplicate key.
-   `groupBy` preserves value order within each group.
-   `uniqueBy` keeps the first value for each key.
-   `minBy` and `maxBy` return `None` for an empty input and keep the first tied value.
-   Collection values and keys must be `defined`; Luau tables cannot store `nil` elements or keys.
-   Callbacks are evaluated from left to right and exactly once for every visited value.

## Roblox signals

```ts
import { connect } from "@rbxts/fp";

const stopListening = connect(button.Activated, () => activate());
stopListening(); // safe to call more than once
```

Use Maid when ownership requires a full cleanup container; this helper only normalizes one connection to the common cleanup-function shape.

## API reference

### Option

| Operation                                         | Behavior                                                                   |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| `some`, `none`, `fromNullable`                    | Construct an Option. `none` returns the shared singleton.                  |
| `map`, `flatMap`, `flatten`, `filter`             | Transform or reject a present value without evaluating callbacks for None. |
| `match`, `isSome`, `isNone`                       | Exhaustively consume or narrow an Option.                                  |
| `unwrap`, `expect`                                | Return Some or throw for None.                                             |
| `unwrapOr`, `unwrapOrElse`                        | Return Some or an eager/lazy fallback.                                     |
| `tap`                                             | Run an effect only for Some and return the original Option.                |
| `zip`                                             | Combine two Some values; otherwise return None.                            |
| `toUndefined`, `toNullable`                       | Convert None to Luau `nil`/roblox-ts `undefined`.                          |
| `okOr`, `okOrElse`                                | Convert None to an eager/lazy typed error.                                 |
| `mapWith`, `flatMapWith`, `filterWith`, `tapWith` | Data-last pipeline adapters.                                               |

### Result

| Operation                                             | Behavior                                                        |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| `ok`, `err`                                           | Construct success or expected failure.                          |
| `map`, `mapErr`, `flatMap`, `flatten`                 | Transform success/error channels while preserving error unions. |
| `match`, `isOk`, `isErr`                              | Exhaustively consume or narrow a Result.                        |
| `unwrap`, `unwrapErr`, `expect`                       | Return the requested channel or throw.                          |
| `unwrapOr`, `unwrapOrElse`                            | Return success or an eager/lazy fallback.                       |
| `recover`                                             | Convert an error into success and eliminate the error channel.  |
| `tap`, `tapErr`                                       | Observe one channel and return the original Result.             |
| `zip`                                                 | Combine successes, preferring the left error.                   |
| `toOption`, `errorToOption`                           | Keep one Result channel as an Option.                           |
| `mapWith`, `mapErrWith`, `flatMapWith`, `recoverWith` | Data-last pipeline adapters.                                    |

### TaskResult

| Operation                                                           | Behavior                                                              |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `succeed`, `fail`, `fromResult`, `fromEffect`                       | Construct or lift cold work without starting it.                      |
| `fromPromise`                                                       | Convert rejection to a typed Err through an explicit mapper.          |
| `run`                                                               | Start a task and return its native cancellable Promise.               |
| `map`, `mapErr`, `flatMap`, `recover`, `orElse`                     | Compose success and expected-failure channels.                        |
| `tap`, `tapErr`                                                     | Observe one resolved Result channel.                                  |
| `zip`, `all`                                                        | Start work in parallel; choose Result errors in input order.          |
| `retry`, `retryWithDelay`                                           | Retry selected typed Err values; rejection remains rejection.         |
| `timeout`                                                           | Cancel overdue work and resolve a caller-defined typed timeout error. |
| `mapWith`, `mapErrWith`, `flatMapWith`, `recoverWith`, `orElseWith` | Data-last pipeline adapters.                                          |

### Effect

| Operation                                                           | Behavior                                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `succeed`, `fail`, `fromResult`                                     | Construct cold effects from existing values.                             |
| `sync`                                                              | Defer synchronous work; thrown values remain defects.                    |
| `try`, `tryResult`, `suspend`                                       | Defer typed thrown work, Result work, or Effect construction.            |
| `run`                                                               | Execute an Effect and return its Result.                                 |
| `map`, `mapErr`, `flatMap`, `recover`, `orElse`                     | Compose success and expected-failure channels.                           |
| `tap`, `tapErr`                                                     | Observe one Result channel during execution.                             |
| `zip`, `all`                                                        | Run effects left-to-right and stop at the first Err.                     |
| `ensuring`, `acquireUseRelease`                                     | Guarantee synchronous finalization after success, Err, or thrown defect. |
| `lift`, `liftResult`                                                | Adapt ordinary functions; not transformer-dependent functions.           |
| `mapWith`, `mapErrWith`, `flatMapWith`, `recoverWith`, `orElseWith` | Data-last pipeline adapters.                                             |

### Other modules

-   `match` exhaustively dispatches literal `{ type: "..." }` unions; `absurd` throws if an impossible value reaches runtime.
-   `pipe`, `flow`, and `compose` preserve inference through nine transformation stages.
-   `identity`, `constant`, and top-level `tap` provide small function-building primitives.
-   `Predicate.and/or/not/all/any` compose boolean predicates and refinements.
-   `Collection` contains data-last forms of every specialized collection transformation.
-   `connect` and `connectionCleanup` normalize Roblox connections to idempotent cleanup functions.

## Testing

```sh
npm run check
rojo build default.project.json --output fp-tests.rbxlx
```

`npm run check` builds the package, compiles the Roblox runtime suite, verifies positive type inference, and verifies expected type errors. Open the isolated `fp-tests.rbxlx` place and press Play; the server runner prints `@rbxts/fp runtime tests passed` only after every runtime assertion succeeds.
