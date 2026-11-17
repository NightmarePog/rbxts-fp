export function identity<T>(value: T): T {
	return value;
}

export function constant<T>(value: T): () => T {
	return () => value;
}

export function tap<T>(value: T, effect: (value: T) => void): T {
	effect(value);
	return value;
}

export function sequence<Arguments extends unknown[]>(
	...effects: ReadonlyArray<(...arguments_: Arguments) => void>
): (...arguments_: Arguments) => void {
	return (...arguments_) => {
		for (const effect of effects) effect(...arguments_);
	};
}

export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, ab: (value: A) => B): B;
export function pipe<A, B, C>(value: A, ab: (value: A) => B, bc: (value: B) => C): C;
export function pipe<A, B, C, D>(value: A, ab: (value: A) => B, bc: (value: B) => C, cd: (value: C) => D): D;
export function pipe<A, B, C, D, E>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
	hi: (value: H) => I,
): I;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
	hi: (value: H) => I,
	ij: (value: I) => J,
): J;
export function pipe(
	value: unknown,
	ab?: (value: unknown) => unknown,
	bc?: (value: unknown) => unknown,
	cd?: (value: unknown) => unknown,
	de?: (value: unknown) => unknown,
	ef?: (value: unknown) => unknown,
	fg?: (value: unknown) => unknown,
	gh?: (value: unknown) => unknown,
	hi?: (value: unknown) => unknown,
	ij?: (value: unknown) => unknown,
): unknown {
	let current = value;
	if (ab !== undefined) current = ab(current);
	if (bc !== undefined) current = bc(current);
	if (cd !== undefined) current = cd(current);
	if (de !== undefined) current = de(current);
	if (ef !== undefined) current = ef(current);
	if (fg !== undefined) current = fg(current);
	if (gh !== undefined) current = gh(current);
	if (hi !== undefined) current = hi(current);
	if (ij !== undefined) current = ij(current);
	return current;
}

/** Runs `value` through `stages` like `pipe`, discarding the final result. */
export function pipeVoid<A>(value: A, ab: (value: A) => unknown): void;
export function pipeVoid<A, B>(value: A, ab: (value: A) => B, bc: (value: B) => unknown): void;
export function pipeVoid<A, B, C>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => unknown,
): void;
export function pipeVoid<A, B, C, D>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => unknown,
): void;
export function pipeVoid<A, B, C, D, E>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => unknown,
): void;
export function pipeVoid<A, B, C, D, E, F>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => unknown,
): void;
export function pipeVoid<A, B, C, D, E, F, G>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => unknown,
): void;
export function pipeVoid<A, B, C, D, E, F, G, H>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
	hi: (value: H) => unknown,
): void;
export function pipeVoid<A, B, C, D, E, F, G, H, I>(
	value: A,
	ab: (value: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
	hi: (value: H) => I,
	ij: (value: I) => unknown,
): void;
export function pipeVoid(value: unknown, ...stages: ReadonlyArray<(value: unknown) => unknown>): void {
	let current = value;
	for (const stage of stages) current = stage(current);
}

export function flow<A extends unknown[], B>(ab: (...args: A) => B): (...args: A) => B;
export function flow<A extends unknown[], B, C>(ab: (...args: A) => B, bc: (value: B) => C): (...args: A) => C;
export function flow<A extends unknown[], B, C, D>(
	ab: (...args: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
): (...args: A) => D;
export function flow<A extends unknown[], B, C, D, E>(
	ab: (...args: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
): (...args: A) => E;
export function flow<A extends unknown[], B, C, D, E, F>(
	ab: (...args: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
): (...args: A) => F;
export function flow<A extends unknown[], B, C, D, E, F, G>(
	ab: (...args: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
): (...args: A) => G;
export function flow<A extends unknown[], B, C, D, E, F, G, H>(
	ab: (...args: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
): (...args: A) => H;
export function flow<A extends unknown[], B, C, D, E, F, G, H, I>(
	ab: (...args: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
	hi: (value: H) => I,
): (...args: A) => I;
export function flow<A extends unknown[], B, C, D, E, F, G, H, I, J>(
	ab: (...args: A) => B,
	bc: (value: B) => C,
	cd: (value: C) => D,
	de: (value: D) => E,
	ef: (value: E) => F,
	fg: (value: F) => G,
	gh: (value: G) => H,
	hi: (value: H) => I,
	ij: (value: I) => J,
): (...args: A) => J;
export function flow(
	first: (...args: unknown[]) => unknown,
	...steps: Array<(value: unknown) => unknown>
): (...args: unknown[]) => unknown {
	return (...args) => {
		let current = first(...args);
		for (const step of steps) current = step(current);
		return current;
	};
}

export function compose<A, B>(ba: (value: A) => B): (value: A) => B;
export function compose<A, B, C>(cb: (value: B) => C, ba: (value: A) => B): (value: A) => C;
export function compose<A, B, C, D>(dc: (value: C) => D, cb: (value: B) => C, ba: (value: A) => B): (value: A) => D;
export function compose<A, B, C, D, E>(
	ed: (value: D) => E,
	dc: (value: C) => D,
	cb: (value: B) => C,
	ba: (value: A) => B,
): (value: A) => E;
export function compose<A, B, C, D, E, F>(
	fe: (value: E) => F,
	ed: (value: D) => E,
	dc: (value: C) => D,
	cb: (value: B) => C,
	ba: (value: A) => B,
): (value: A) => F;
export function compose<A, B, C, D, E, F, G>(
	gf: (value: F) => G,
	fe: (value: E) => F,
	ed: (value: D) => E,
	dc: (value: C) => D,
	cb: (value: B) => C,
	ba: (value: A) => B,
): (value: A) => G;
export function compose<A, B, C, D, E, F, G, H>(
	hg: (value: G) => H,
	gf: (value: F) => G,
	fe: (value: E) => F,
	ed: (value: D) => E,
	dc: (value: C) => D,
	cb: (value: B) => C,
	ba: (value: A) => B,
): (value: A) => H;
export function compose<A, B, C, D, E, F, G, H, I>(
	ih: (value: H) => I,
	hg: (value: G) => H,
	gf: (value: F) => G,
	fe: (value: E) => F,
	ed: (value: D) => E,
	dc: (value: C) => D,
	cb: (value: B) => C,
	ba: (value: A) => B,
): (value: A) => I;
export function compose<A, B, C, D, E, F, G, H, I, J>(
	ji: (value: I) => J,
	ih: (value: H) => I,
	hg: (value: G) => H,
	gf: (value: F) => G,
	fe: (value: E) => F,
	ed: (value: D) => E,
	dc: (value: C) => D,
	cb: (value: B) => C,
	ba: (value: A) => B,
): (value: A) => J;
export function compose(...steps: Array<(value: unknown) => unknown>): (value: unknown) => unknown {
	return (value) => {
		let current = value;
		for (let index = steps.size() - 1; index >= 0; index--) current = steps[index](current);
		return current;
	};
}
