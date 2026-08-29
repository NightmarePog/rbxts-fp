-- Compiled with roblox-ts v3.0.0
local NONE = {
	type = "none",
}
local function some(value)
	return {
		type = "some",
		value = value,
	}
end
local function none()
	return NONE
end
local function isSome(option)
	return option.type == "some"
end
local function isNone(option)
	return option.type == "none"
end
local function map(option, transform)
	return if option.type == "some" then some(transform(option.value)) else NONE
end
local function flatMap(option, transform)
	return if option.type == "some" then transform(option.value) else NONE
end
local function flatten(option)
	return if option.type == "some" then option.value else NONE
end
local function filter(option, predicate)
	return if option.type == "some" and predicate(option.value) then option else NONE
end
local function match(option, cases)
	return if option.type == "some" then cases.some(option.value) else cases.none()
end
local function unwrap(option)
	local _arg0 = option.type == "some"
	assert(_arg0, "Tried to unwrap None")
	return option.value
end
local function expect(option, message)
	local _arg0 = option.type == "some"
	local _message = message
	assert(_arg0, _message)
	return option.value
end
local function unwrapOr(option, fallback)
	return if option.type == "some" then option.value else fallback
end
local function unwrapOrElse(option, fallback)
	return if option.type == "some" then option.value else fallback()
end
local function tap(option, effect)
	if option.type == "some" then
		effect(option.value)
	end
	return option
end
local function zip(left, right)
	return if left.type == "some" and right.type == "some" then some({ left.value, right.value }) else NONE
end
local function fromNullable(value)
	return if value == nil then NONE else some(value)
end
--* Luau has one absence value (`nil`), represented by `undefined` in roblox-ts. 
local function toNullable(option)
	return if option.type == "some" then option.value else nil
end
local toUndefined = toNullable
local function okOr(option, errorValue)
	return if option.type == "some" then {
		type = "ok",
		value = option.value,
	} else {
		type = "err",
		error = errorValue,
	}
end
local function okOrElse(option, createError)
	return if option.type == "some" then {
		type = "ok",
		value = option.value,
	} else {
		type = "err",
		error = createError(),
	}
end
--* Creates a data-last Option mapper for use in `pipe`. 
local function mapWith(transform)
	return function(option)
		return map(option, transform)
	end
end
--* Creates a data-last Option flat-mapper for use in `pipe`. 
local function flatMapWith(transform)
	return function(option)
		return flatMap(option, transform)
	end
end
local function filterWith(predicate)
	return function(option)
		return filter(option, predicate)
	end
end
--* Creates a data-last Option side effect for use in `pipe`. 
local function tapWith(effect)
	return function(option)
		return tap(option, effect)
	end
end
local Option = {
	some = some,
	none = none,
	fromNullable = fromNullable,
	isSome = isSome,
	isNone = isNone,
	map = map,
	flatMap = flatMap,
	flatten = flatten,
	filter = filter,
	match = match,
	unwrap = unwrap,
	expect = expect,
	unwrapOr = unwrapOr,
	unwrapOrElse = unwrapOrElse,
	tap = tap,
	zip = zip,
	toNullable = toNullable,
	toUndefined = toUndefined,
	okOr = okOr,
	okOrElse = okOrElse,
	mapWith = mapWith,
	flatMapWith = flatMapWith,
	filterWith = filterWith,
	tapWith = tapWith,
}
return {
	some = some,
	none = none,
	isSome = isSome,
	isNone = isNone,
	map = map,
	flatMap = flatMap,
	flatten = flatten,
	filter = filter,
	match = match,
	unwrap = unwrap,
	expect = expect,
	unwrapOr = unwrapOr,
	unwrapOrElse = unwrapOrElse,
	tap = tap,
	zip = zip,
	fromNullable = fromNullable,
	toNullable = toNullable,
	okOr = okOr,
	okOrElse = okOrElse,
	mapWith = mapWith,
	flatMapWith = flatMapWith,
	filterWith = filterWith,
	tapWith = tapWith,
	Option = Option,
	toUndefined = toUndefined,
}
