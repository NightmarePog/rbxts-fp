import { Collection, Effect, Option, TaskResult, groupBy, match, pipe } from "../../out";

type State =
	| { readonly type: "idle" }
	| { readonly type: "moving"; readonly speed: number }
	| { readonly type: "braking"; readonly force: number };

declare const state: State;

// @ts-expect-error every union member must have a handler
match(state, { idle: () => "idle", moving: () => "moving" });

// @ts-expect-error adjacent pipeline stages must agree on their value type
// prettier-ignore
pipe(1, (value) => `${value}`, (value: number) => value + 1);

// @ts-expect-error Some cannot contain Luau nil
Option.some(undefined);

// @ts-expect-error Luau tables cannot store nil keys
groupBy([1, 2], () => undefined);

// @ts-expect-error data-last collection selectors also reject nil keys
// prettier-ignore
pipe([1, 2], Collection.keyBy(() => undefined));

// @ts-expect-error Promise rejection conversion must provide an explicit mapper
TaskResult.fromPromise(() => Promise.resolve(1));

// @ts-expect-error typed thrown-error conversion must provide an explicit mapper
Effect.try(() => 1);
