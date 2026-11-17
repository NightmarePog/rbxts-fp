-- Compiled with roblox-ts v3.0.0
local function identity(value)
	return value
end
local function constant(value)
	return function()
		return value
	end
end
local function tap(value, effect)
	effect(value)
	return value
end
local function sequence(...)
	local effects = { ... }
	return function(...)
		local arguments_ = { ... }
		for _, effect in effects do
			effect(unpack(arguments_))
		end
	end
end
local function pipe(value, ab, bc, cd, de, ef, fg, gh, hi, ij)
	local current = value
	if ab ~= nil then
		current = ab(current)
	end
	if bc ~= nil then
		current = bc(current)
	end
	if cd ~= nil then
		current = cd(current)
	end
	if de ~= nil then
		current = de(current)
	end
	if ef ~= nil then
		current = ef(current)
	end
	if fg ~= nil then
		current = fg(current)
	end
	if gh ~= nil then
		current = gh(current)
	end
	if hi ~= nil then
		current = hi(current)
	end
	if ij ~= nil then
		current = ij(current)
	end
	return current
end
--* Runs `value` through `stages` like `pipe`, discarding the final result. 
local function pipeVoid(value, ...)
	local stages = { ... }
	local current = value
	for _, stage in stages do
		current = stage(current)
	end
end
local function flow(first, ...)
	local steps = { ... }
	return function(...)
		local args = { ... }
		local current = first(unpack(args))
		for _, step in steps do
			current = step(current)
		end
		return current
	end
end
local function compose(...)
	local steps = { ... }
	return function(value)
		local current = value
		for index = #steps - 1, 0, -1 do
			current = steps[index + 1](current)
		end
		return current
	end
end
return {
	identity = identity,
	constant = constant,
	tap = tap,
	sequence = sequence,
	pipe = pipe,
	pipeVoid = pipeVoid,
	flow = flow,
	compose = compose,
}
