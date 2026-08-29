-- Compiled with roblox-ts v3.0.0
--[[
	*
	 * Exhaustively dispatches a conventional `{ type: "..." }` union.
	 *
	 * The internal casts erase a relationship TypeScript cannot retain when a
	 * generic discriminant indexes a mapped type. They do not widen the public API.
	 
]]
local function match(value, handlers)
	local erasedHandlers = handlers
	local handler = erasedHandlers[value.type]
	return handler(value)
end
local function absurd(value)
	error(`Reached an impossible value: {tostring(value)}`)
end
return {
	match = match,
	absurd = absurd,
}
