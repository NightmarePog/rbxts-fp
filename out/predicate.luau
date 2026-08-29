-- Compiled with roblox-ts v3.0.0
local function andPredicate(left, right)
	return function(value)
		return left(value) and right(value)
	end
end
local function orPredicate(left, right)
	return function(value)
		return left(value) or right(value)
	end
end
local function notPredicate(predicate)
	return function(value)
		return not predicate(value)
	end
end
local function all(...)
	local predicates = { ... }
	return function(value)
		for _, predicate in predicates do
			if not predicate(value) then
				return false
			end
		end
		return true
	end
end
local function any(...)
	local predicates = { ... }
	return function(value)
		for _, predicate in predicates do
			if predicate(value) then
				return true
			end
		end
		return false
	end
end
--* Luau keywords are exposed as properties, so `Predicate.and` compiles cleanly. 
local Predicate = {
	["and"] = andPredicate,
	["or"] = orPredicate,
	["not"] = notPredicate,
	all = all,
	any = any,
}
return {
	andPredicate = andPredicate,
	orPredicate = orPredicate,
	notPredicate = notPredicate,
	all = all,
	any = any,
	Predicate = Predicate,
}
