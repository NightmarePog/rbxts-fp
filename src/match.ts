export type Tagged = { readonly type: string };

export type MatchHandlers<Union extends Tagged> = {
	readonly [Tag in Union["type"]]: (value: Extract<Union, { readonly type: Tag }>) => unknown;
};

export type MatchResult<Union extends Tagged, Handlers extends MatchHandlers<Union>> = ReturnType<
	Handlers[Union["type"]]
>;

/**
 * Exhaustively dispatches a conventional `{ type: "..." }` union.
 *
 * The internal casts erase a relationship TypeScript cannot retain when a
 * generic discriminant indexes a mapped type. They do not widen the public API.
 */
export function match<Union extends Tagged, Handlers extends MatchHandlers<Union>>(
	value: Union,
	handlers: Handlers,
): MatchResult<Union, Handlers> {
	type ErasedHandler = (value: Union) => unknown;
	const erasedHandlers = handlers as unknown as Record<string, ErasedHandler>;
	const handler = erasedHandlers[value.type];
	return handler(value) as MatchResult<Union, Handlers>;
}

export function absurd(value: never): never {
	throw `Reached an impossible value: ${tostring(value)}`;
}
