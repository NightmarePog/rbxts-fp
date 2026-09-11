import {
	Collection,
	Effect,
	Option,
	Predicate,
	Result,
	TaskResult,
	absurd,
	clearAttributeValues,
	compose,
	connectionCleanup,
	clearAttributes,
	filterMap,
	findMap,
	flow,
	groupBy,
	keyBy,
	match,
	maxBy,
	minBy,
	partition,
	pipe,
	scan,
	sequence,
	setAttributeValue,
	setAttributeValues,
	setAttributes,
	sumBy,
	uniqueBy,
	zipWith,
} from "../out";

function equal<T>(actual: T, expected: T, label: string): void {
	assert(actual === expected, `${label}: expected ${tostring(expected)}, got ${tostring(actual)}`);
}

function throws(callback: () => void, label: string): void {
	const [succeeded] = pcall(callback);
	equal(succeeded, false, label);
}

export function runRuntimeTests(): void {
	const sequencedValues = new Array<number>();
	sequence(
		(value: number) => sequencedValues.push(value),
		(value) => sequencedValues.push(value * 2),
	)(3);
	equal(sequencedValues.join(","), "3,6", "sequence order and arguments");
	const attributed = new Instance("Folder");
	setAttributeValues(attributed, "Count", 2, "Ready", true);
	equal(attributed.GetAttribute("Count"), 2, "setAttributeValues number");
	equal(attributed.GetAttribute("Ready"), true, "setAttributeValues boolean");
	clearAttributeValues(attributed, "Count", "Ready");
	equal(attributed.GetAttribute("Count"), undefined, "clearAttributeValues");
	setAttributeValue(attributed, false, "First", "Second");
	equal(attributed.GetAttribute("Second"), false, "setAttributeValue");
	const chainedInstance = setAttributes<Folder>(true, "First", "Second")(attributed);
	equal(chainedInstance, attributed, "setAttributes chain value");
	equal(attributed.GetAttribute("First"), true, "setAttributes first");
	clearAttributes<Folder>("First", "Second")(attributed);
	equal(attributed.GetAttribute("Second"), undefined, "clearAttributes");
	attributed.Destroy();

	equal(Option.unwrap(Option.map(Option.some(2), (value) => value * 3)), 6, "Option.map");
	equal(
		Option.unwrapOrElse(Option.none<number>(), () => 4),
		4,
		"Option.unwrapOrElse",
	);
	equal(Option.isNone(Option.filter(Option.some(2), (value) => value > 3)), true, "Option.filter");
	equal(Option.unwrap(Option.zip(Option.some(1), Option.some("carriage")))[1], "carriage", "Option.zip");
	equal(Option.toNullable(Option.none()), undefined, "Option.toNullable");
	equal(Result.unwrap(Option.okOr(Option.some(3), "missing")), 3, "Option.okOr");
	equal(Option.unwrap(Option.flatten(Option.some(Option.some(7)))), 7, "Option.flatten");
	equal(Option.unwrap(Option.flatMap(Option.some(2), (value) => Option.some(value * 4))), 8, "Option.flatMap");
	let optionFallbackCalls = 0;
	Option.unwrapOrElse(Option.some(1), () => {
		optionFallbackCalls++;
		return 2;
	});
	equal(optionFallbackCalls, 0, "Option lazy fallback");
	let optionTapValue = 0;
	Option.tap(Option.some(5), (value) => (optionTapValue = value));
	equal(optionTapValue, 5, "Option.tap");
	throws(() => Option.unwrap(Option.none()), "Option.unwrap None");
	throws(() => Option.expect(Option.none(), "expected value"), "Option.expect None");

	equal(Result.unwrap(Result.map(Result.ok(2), (value) => value + 1)), 3, "Result.map");
	equal(
		Result.unwrapOrElse(Result.err("failed"), (errorValue) => errorValue.size()),
		6,
		"Result.unwrapOrElse",
	);
	equal(Result.unwrapErr(Result.mapErr(Result.err("failed"), (errorValue) => errorValue.size())), 6, "Result.mapErr");
	equal(Result.unwrap(Result.recover(Result.err("failed"), () => 8)), 8, "Result.recover");
	equal(Result.unwrap(Result.zip(Result.ok(2), Result.ok(4)))[1], 4, "Result.zip");
	equal(Option.unwrap(Result.toOption(Result.ok("ready"))), "ready", "Result.toOption");
	equal(Result.unwrap(Result.flatten(Result.ok(Result.ok(9)))), 9, "Result.flatten");
	equal(
		Result.unwrapErr(Result.flatMap(Result.err("first"), () => Result.err("second"))),
		"first",
		"Result.flatMap error",
	);
	equal(Result.unwrapErr(Result.zip(Result.err("left"), Result.err("right"))), "left", "Result.zip left error");
	let resultTapValue = 0;
	let resultTapError = "";
	Result.tap(Result.ok(6), (value) => (resultTapValue = value));
	Result.tapErr(Result.err("bad"), (errorValue) => (resultTapError = errorValue));
	equal(resultTapValue, 6, "Result.tap");
	equal(resultTapError, "bad", "Result.tapErr");
	throws(() => Result.unwrap(Result.err("bad")), "Result.unwrap Err");
	throws(() => Result.unwrapErr(Result.ok(1)), "Result.unwrapErr Ok");

	const values = filterMap([1, 2, 3, 4], (value) => (value % 2 === 0 ? Option.some(value * 10) : Option.none()));
	equal(values.size(), 2, "filterMap size");
	equal(values[1], 40, "filterMap value");
	equal(Option.unwrap(findMap([1, 2, 3], (value) => (value > 1 ? Option.some(value) : Option.none()))), 2, "findMap");
	equal(Option.unwrap(maxBy([{ score: 1 }, { score: 3 }], (value) => value.score)).score, 3, "maxBy");
	equal(Option.isNone(minBy([], (value: number) => value)), true, "minBy empty");
	const [even, odd] = partition([1, 2, 3, 4], (value) => value % 2 === 0);
	equal(even.size(), 2, "partition matched");
	equal(odd.size(), 2, "partition unmatched");
	equal(
		groupBy(["a", "bb", "c"], (value) => value.size())
			.get(1)
			?.size(),
		2,
		"groupBy",
	);
	equal(scan([1, 2, 3], 0, (total, value) => total + value)[2], 6, "scan");
	equal(zipWith([1, 2], [3, 4, 5], (left, right) => left + right).size(), 2, "zipWith shortest");
	equal(uniqueBy([1, 1, 2], (value) => value).size(), 2, "uniqueBy");
	equal(
		sumBy([{ value: 2 }, { value: 3 }], (item) => item.value),
		5,
		"sumBy",
	);
	equal(
		keyBy(
			[
				{ id: "same", value: 1 },
				{ id: "same", value: 2 },
			],
			(item) => item.id,
		).get("same")?.value,
		2,
		"keyBy last wins",
	);
	equal(
		Option.unwrap(
			pipe(
				[1, 3, 2],
				Collection.maxBy<number>((value) => value),
			),
		),
		3,
		"Collection.maxBy pipeline",
	);

	type State = { readonly type: "idle" } | { readonly type: "moving"; readonly speed: number };
	const state: State = { type: "moving", speed: 12 };
	equal(match(state, { idle: () => 0, moving: (moving) => moving.speed }), 12, "match");
	equal(
		pipe(
			2,
			(value) => value + 2,
			(value) => value * 3,
		),
		12,
		"pipe",
	);
	equal(flow((left: number, right: number) => left + right, tostring)(2, 3), "5", "flow");
	equal(
		compose(
			(value: number) => value * 3,
			(value: number) => value + 2,
		)(2),
		12,
		"compose",
	);
	equal(
		Predicate.all<number>(
			(value) => value > 0,
			(value) => value < 3,
		)(2),
		true,
		"Predicate.all",
	);
	equal(
		Predicate.any<number>(
			(value) => value < 0,
			(value) => value === 2,
		)(2),
		true,
		"Predicate.any",
	);
	const positive = (value: number): value is number => value > 0;
	equal(Predicate.and(positive, (value) => value < 3)(2), true, "Predicate.and");
	equal(
		Predicate.or<number, number, number>(positive, (value): value is number => value === 0)(0),
		true,
		"Predicate.or",
	);
	equal(Predicate.not(positive)(-1), true, "Predicate.not");
	equal(Predicate.all<number>()(2), true, "Predicate.all empty");
	equal(Predicate.any<number>()(2), false, "Predicate.any empty");
	equal(
		Option.unwrap(
			pipe(
				Option.some(2),
				Option.mapWith((value: number) => value * 5),
			),
		),
		10,
		"Option.mapWith",
	);
	equal(
		Result.unwrap(
			pipe(
				Result.ok(2),
				Result.mapWith((value: number) => value * 6),
			),
		),
		12,
		"Result.mapWith",
	);
	throws(() => absurd("invalid" as never), "absurd");

	let effectRuns = 0;
	const coldEffect = Effect.sync(() => {
		effectRuns++;
		return 3;
	});
	const mappedEffect = Effect.map(coldEffect, (value) => value * 2);
	equal(effectRuns, 0, "Effect cold before run");
	equal(Result.unwrap(Effect.run(mappedEffect)), 6, "Effect.map");
	equal(effectRuns, 1, "Effect cold after run");

	const attemptedEffect = Effect.try(
		() => error("invalid instance"),
		(reason) => `creation:${tostring(reason)}`,
	);
	equal(Result.unwrapErr(Effect.run(attemptedEffect)).find("creation:")[0] !== undefined, true, "Effect.try");

	let skippedRuns = 0;
	const stoppedEffect = Effect.flatMap(Effect.fail("stopped"), () =>
		Effect.sync(() => {
			skippedRuns++;
			return 1;
		}),
	);
	equal(Result.unwrapErr(Effect.run(stoppedEffect)), "stopped", "Effect.flatMap error");
	equal(skippedRuns, 0, "Effect.flatMap short circuit");

	const liftedAdd = Effect.lift((left: number, right: number) => left + right);
	equal(Result.unwrap(Effect.run(liftedAdd(2, 4))), 6, "Effect.lift");

	let finalizations = 0;
	const finalizedFailure = Effect.ensuring(
		Effect.fail("failed"),
		Effect.sync(() => {
			finalizations++;
		}),
	);
	equal(Result.unwrapErr(Effect.run(finalizedFailure)), "failed", "Effect.ensuring result");
	equal(finalizations, 1, "Effect.ensuring typed failure");

	const finalizedDefect = Effect.ensuring(
		Effect.sync(() => error("defect")),
		Effect.sync(() => {
			finalizations++;
		}),
	);
	throws(() => Effect.run(finalizedDefect), "Effect.ensuring defect");
	equal(finalizations, 2, "Effect.ensuring thrown defect");

	let releasedResource = "";
	const resourceProgram = Effect.acquireUseRelease(
		Effect.succeed("signal"),
		(resource) => Effect.succeed(`${resource}:used`),
		(resource) =>
			Effect.sync(() => {
				releasedResource = resource;
			}),
	);
	equal(Result.unwrap(Effect.run(resourceProgram)), "signal:used", "Effect.acquireUseRelease result");
	equal(releasedResource, "signal", "Effect.acquireUseRelease cleanup");

	let taskStarts = 0;
	const coldTask = () => {
		taskStarts++;
		return Promise.resolve(Result.ok<number, "load">(2));
	};
	const mappedTask = TaskResult.map(coldTask, (value) => value * 3);
	equal(taskStarts, 0, "TaskResult cold before run");
	equal(Result.unwrap(TaskResult.run(mappedTask).expect()), 6, "TaskResult.map");
	equal(taskStarts, 1, "TaskResult cold after run");
	equal(Result.unwrap(TaskResult.fromEffect(Effect.sync(() => 9))().expect()), 9, "TaskResult.fromEffect");

	const chainedTask = TaskResult.flatMap(TaskResult.succeed<number, "first">(2), (value) =>
		TaskResult.succeed<string, "second">(`${value}`),
	);
	equal(Result.unwrap(chainedTask().expect()), "2", "TaskResult.flatMap");
	equal(
		Result.unwrapErr(TaskResult.map(TaskResult.fail("stopped"), () => 1)().expect()),
		"stopped",
		"TaskResult short circuit",
	);

	const mappedRejection = TaskResult.fromPromise(
		() => new Promise<number>((_, reject) => reject("offline")),
		(reason) => `network:${tostring(reason)}`,
	);
	equal(Result.unwrapErr(mappedRejection().expect()), "network:offline", "TaskResult.fromPromise");

	let attempts = 0;
	const unreliable = () => {
		attempts++;
		return Promise.resolve(attempts < 3 ? Result.err<"retry", number>("retry") : Result.ok<number, "retry">(7));
	};
	equal(Result.unwrap(TaskResult.retry(unreliable, 2)().expect()), 7, "TaskResult.retry value");
	equal(attempts, 3, "TaskResult.retry attempts");

	const combined = TaskResult.all([TaskResult.succeed<number, string>(1), TaskResult.succeed<number, string>(2)]);
	equal(Result.unwrap(combined().expect())[1], 2, "TaskResult.all");
	equal(
		Result.unwrapErr(TaskResult.zip(TaskResult.fail("left"), TaskResult.fail("right"))().expect()),
		"left",
		"TaskResult.zip left error",
	);

	let timeoutCancelled = false;
	const neverFinishes = () =>
		new Promise<Result<number, "source">>((_, __, onCancel) => {
			onCancel(() => (timeoutCancelled = true));
		});
	const timed = TaskResult.timeout(neverFinishes, 0, () => "timeout" as const)().expect();
	equal(Result.unwrapErr(timed), "timeout", "TaskResult.timeout error");
	equal(timeoutCancelled, true, "TaskResult.timeout cancellation");
	throws(
		() => TaskResult.timeout(neverFinishes, 0, () => error("timeout mapper defect"))().expect(),
		"TaskResult.timeout mapper defect",
	);

	let disconnectCalls = 0;
	const connection = {
		Connected: true,
		Disconnect() {
			this.Connected = false;
			disconnectCalls++;
		},
	} as RBXScriptConnection;
	const cleanup = connectionCleanup(connection);
	cleanup();
	cleanup();
	equal(disconnectCalls, 1, "connection cleanup idempotency");
}
