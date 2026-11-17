import {
	Collection,
	Effect,
	Option,
	Predicate,
	Result,
	TaskResult,
	compose,
	filterMap,
	flow,
	match,
	pipe,
	pipeVoid,
	type Refinement,
	type Effect as EffectType,
	type TaskResult as TaskResultType,
} from "../out";

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

const piped = pipe(
	2,
	(value) => value + 1,
	(value) => `${value}`,
	(value) => value.size(),
);
type PipeInference = Expect<Equal<typeof piped, number>>;

const pipedVoid = pipeVoid(
	2,
	(value) => `${value}`,
	(value) => value.size(),
);
type PipeVoidInference = Expect<Equal<typeof pipedVoid, void>>;

const formatted = flow(
	(left: number, right: number) => left + right,
	(value) => `${value}`,
);
type FlowInference = Expect<Equal<ReturnType<typeof formatted>, string>>;

const longFlow = flow(
	(value: number) => value + 1,
	(value) => value + 1,
	(value) => value + 1,
	(value) => value + 1,
	(value) => value + 1,
	(value) => value + 1,
	(value) => value + 1,
	(value) => value + 1,
	(value) => `${value}`,
);
type LongFlowInference = Expect<Equal<ReturnType<typeof longFlow>, string>>;

const longCompose = compose(
	(value: number) => `${value}`,
	(value: number) => value + 1,
	(value: number) => value + 1,
	(value: number) => value + 1,
	(value: number) => value + 1,
	(value: number) => value + 1,
	(value: number) => value + 1,
	(value: number) => value + 1,
	(value: number) => value + 1,
);
type LongComposeInference = Expect<Equal<ReturnType<typeof longCompose>, string>>;

const option = Option.fromNullable("train" as string | undefined);
type OptionInference = Expect<Equal<typeof option, Option<string>>>;

if (Option.isSome(option)) {
	type OptionNarrowing = Expect<Equal<typeof option.value, string>>;
	const optionNarrowing: OptionNarrowing = true;
	assert(optionNarrowing);
}

const chainedResult = Result.flatMap(Result.ok<number, "initial">(1), (value) =>
	value > 0 ? Result.ok<string, "next">(`${value}`) : Result.err<"next", string>("next"),
);
type ErrorUnion = Expect<Equal<typeof chainedResult, Result<string, "initial" | "next">>>;

if (Result.isErr(chainedResult)) {
	type ResultNarrowing = Expect<Equal<typeof chainedResult.error, "initial" | "next">>;
	const resultNarrowing: ResultNarrowing = true;
	assert(resultNarrowing);
}

type State =
	| { readonly type: "idle" }
	| { readonly type: "moving"; readonly speed: number }
	| { readonly type: "braking"; readonly force: number };

declare const state: State;
const description = match(state, {
	idle: () => "idle",
	moving: (moving) => `moving ${moving.speed}`,
	braking: (braking) => braking.force,
});
type MatchReturn = Expect<Equal<typeof description, string | number>>;

type Vehicle = { readonly type: "train"; readonly speed: number } | { readonly type: "bus" };
const isTrain: Refinement<Vehicle, Extract<Vehicle, { type: "train" }>> = (
	vehicle,
): vehicle is Extract<Vehicle, { type: "train" }> => vehicle.type === "train";
const isMovingTrain = Predicate.and(
	isTrain,
	(vehicle): vehicle is Extract<Vehicle, { type: "train" }> => vehicle.speed > 0,
);
const vehicles = new Array<Vehicle>();
const movingTrains = vehicles.filter(isMovingTrain);
type RefinementInference = Expect<Equal<(typeof movingTrains)[number], Extract<Vehicle, { type: "train" }>>>;

const numbers = filterMap(["1", "skip"], (value) =>
	value === "skip" ? Option.none() : Option.some(tonumber(value) ?? 0),
);
type FilterMapInference = Expect<Equal<(typeof numbers)[number], number>>;

const pipedOption = pipe(
	Option.some(2),
	Option.mapWith((value: number) => `${value}`),
);
type PipedOptionInference = Expect<Equal<typeof pipedOption, Option<string>>>;

const pipedResult = pipe(
	Result.ok<number, "first">(2),
	Result.flatMapWith((value: number) => Result.ok<string, "second">(`${value}`)),
);
type PipedResultInference = Expect<Equal<typeof pipedResult, Result<string, "first" | "second">>>;

const grouped = pipe(
	[{ kind: "train" as const }],
	Collection.groupBy((value: { kind: "train" }) => value.kind),
);
type GroupedInference = Expect<Equal<typeof grouped, Map<"train", { kind: "train" }[]>>>;

const effect = pipe(
	Effect.succeed<number, "create">(2),
	Effect.flatMapWith((value: number) => Effect.succeed<string, "configure">(`${value}`)),
);
type EffectInference = Expect<Equal<typeof effect, EffectType<string, "create" | "configure">>>;

const lifted = Effect.lift((name: string, anchored: boolean) => ({ name, anchored }));
type LiftedEffect = Expect<Equal<ReturnType<typeof lifted>, EffectType<{ name: string; anchored: boolean }, never>>>;

const attempted = Effect.try(
	() => 1,
	() => "defect" as const,
);
type AttemptedEffect = Expect<Equal<typeof attempted, EffectType<number, "defect">>>;

const effectTask = TaskResult.fromEffect(effect);
type EffectTask = Expect<Equal<typeof effectTask, TaskResultType<string, "create" | "configure">>>;

const taskResult = pipe(
	TaskResult.succeed<number, "load">(2),
	TaskResult.flatMapWith((value: number) => TaskResult.succeed<string, "format">(`${value}`)),
);
type TaskResultInference = Expect<Equal<typeof taskResult, TaskResultType<string, "load" | "format">>>;

const recoveredTask = TaskResult.orElse(TaskResult.fail<"missing", number>("missing"), () =>
	TaskResult.succeed<string, "fallback">("default"),
);
type TaskResultRecovery = Expect<Equal<typeof recoveredTask, TaskResultType<number | string, "fallback">>>;

const timedTask = TaskResult.timeout(TaskResult.succeed<number, "load">(1), 1, () => "timeout" as const);
type TaskResultTimeout = Expect<Equal<typeof timedTask, TaskResultType<number, "load" | "timeout">>>;

export type TypeTestResults =
	| PipeInference
	| FlowInference
	| LongFlowInference
	| LongComposeInference
	| OptionInference
	| ErrorUnion
	| MatchReturn
	| RefinementInference
	| FilterMapInference
	| PipedOptionInference
	| PipedResultInference
	| GroupedInference
	| EffectInference
	| LiftedEffect
	| AttemptedEffect
	| EffectTask
	| TaskResultInference
	| TaskResultRecovery
	| TaskResultTimeout;
