-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _option = TS.import(script, script.Parent, "option")
local none = _option.none
local some = _option.some
local function ok(value)
	return {
		type = "ok",
		value = value,
	}
end
local function err(errorValue)
	return {
		type = "err",
		error = errorValue,
	}
end
local function isOk(result)
	return result.type == "ok"
end
local function isErr(result)
	return result.type == "err"
end
local function map(result, transform)
	return if result.type == "ok" then ok(transform(result.value)) else result
end
local function mapErr(result, transform)
	return if result.type == "err" then err(transform(result.error)) else result
end
local function flatMap(result, transform)
	return if result.type == "ok" then transform(result.value) else result
end
local function flatten(result)
	return if result.type == "ok" then result.value else result
end
local function match(result, cases)
	return if result.type == "ok" then cases.ok(result.value) else cases.err(result.error)
end
local function unwrap(result)
	if result.type == "err" then
		error(`Tried to unwrap Err: {tostring(result.error)}`)
	end
	return result.value
end
local function unwrapErr(result)
	if result.type == "ok" then
		error("Tried to unwrapErr Ok")
	end
	return result.error
end
local function expect(result, message)
	local _arg0 = result.type == "ok"
	local _message = message
	assert(_arg0, _message)
	return result.value
end
local function unwrapOr(result, fallback)
	return if result.type == "ok" then result.value else fallback
end
local function unwrapOrElse(result, fallback)
	return if result.type == "ok" then result.value else fallback(result.error)
end
local function recover(result, recovery)
	return if result.type == "ok" then result else ok(recovery(result.error))
end
local function tap(result, effect)
	if result.type == "ok" then
		effect(result.value)
	end
	return result
end
local function tapErr(result, effect)
	if result.type == "err" then
		effect(result.error)
	end
	return result
end
--* Combines successes, preferring the left error when both inputs fail. 
local function zip(left, right)
	if left.type == "err" then
		return left
	end
	if right.type == "err" then
		return right
	end
	return ok({ left.value, right.value })
end
local function toOption(result)
	return if result.type == "ok" then some(result.value) else none()
end
local function errorToOption(result)
	return if result.type == "err" then some(result.error) else none()
end
--* Creates a data-last success mapper for use in `pipe`. 
local function mapWith(transform)
	return function(result)
		return map(result, transform)
	end
end
--* Creates a data-last error mapper for use in `pipe`. 
local function mapErrWith(transform)
	return function(result)
		return mapErr(result, transform)
	end
end
--* Creates a data-last success flat-mapper while preserving both error types. 
local function flatMapWith(transform)
	return function(result)
		return flatMap(result, transform)
	end
end
--* Creates a data-last recovery operation for use in `pipe`. 
local function recoverWith(recovery)
	return function(result)
		return recover(result, recovery)
	end
end
local Result = {
	ok = ok,
	err = err,
	isOk = isOk,
	isErr = isErr,
	map = map,
	mapErr = mapErr,
	flatMap = flatMap,
	flatten = flatten,
	match = match,
	unwrap = unwrap,
	unwrapErr = unwrapErr,
	expect = expect,
	unwrapOr = unwrapOr,
	unwrapOrElse = unwrapOrElse,
	recover = recover,
	tap = tap,
	tapErr = tapErr,
	zip = zip,
	toOption = toOption,
	errorToOption = errorToOption,
	mapWith = mapWith,
	mapErrWith = mapErrWith,
	flatMapWith = flatMapWith,
	recoverWith = recoverWith,
}
return {
	ok = ok,
	err = err,
	isOk = isOk,
	isErr = isErr,
	map = map,
	mapErr = mapErr,
	flatMap = flatMap,
	flatten = flatten,
	match = match,
	unwrap = unwrap,
	unwrapErr = unwrapErr,
	expect = expect,
	unwrapOr = unwrapOr,
	unwrapOrElse = unwrapOrElse,
	recover = recover,
	tap = tap,
	tapErr = tapErr,
	zip = zip,
	toOption = toOption,
	errorToOption = errorToOption,
	mapWith = mapWith,
	mapErrWith = mapErrWith,
	flatMapWith = flatMapWith,
	recoverWith = recoverWith,
	Result = Result,
}
