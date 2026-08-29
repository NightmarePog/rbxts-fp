-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _result = TS.import(script, script.Parent, "result")
local err = _result.err
local ok = _result.ok
local Result = _result.Result
--* A cold synchronous operation with a typed expected-failure channel. 
local function succeed(value)
	return function()
		return ok(value)
	end
end
local function fail(errorValue)
	return function()
		return err(errorValue)
	end
end
local function fromResult(result)
	return function()
		return result
	end
end
--* Defers synchronous work. Thrown errors remain defects and are not typed failures. 
local function sync(evaluate)
	return function()
		return ok(evaluate())
	end
end
--* Defers synchronous work and explicitly maps a thrown value into the typed error channel. 
local function tryEffect(evaluate, onThrow)
	return function()
		local succeeded, value = pcall(evaluate)
		return if succeeded then ok(value) else err(onThrow(value))
	end
end
--* Defers a function that already describes expected failure with Result. 
local function tryResult(evaluate)
	return evaluate
end
--* Defers construction of another Effect, useful for recursion and conditional programs. 
local function suspend(evaluate)
	return function()
		return evaluate()()
	end
end
local function run(effect)
	return effect()
end
local function map(effect, transform)
	return function()
		local result = effect()
		return if result.type == "ok" then ok(transform(result.value)) else result
	end
end
local function mapErr(effect, transform)
	return function()
		local result = effect()
		return if result.type == "err" then err(transform(result.error)) else result
	end
end
local function flatMap(effect, transform)
	return function()
		local result = effect()
		return if result.type == "ok" then transform(result.value)() else result
	end
end
local function recover(effect, recovery)
	return function()
		return Result.recover(effect(), recovery)
	end
end
local function orElse(effect, recovery)
	return function()
		local result = effect()
		return if result.type == "ok" then result else recovery(result.error)()
	end
end
local function tap(effect, observe)
	return function()
		return Result.tap(effect(), observe)
	end
end
local function tapErr(effect, observe)
	return function()
		return Result.tapErr(effect(), observe)
	end
end
--* Runs left-to-right and stops before running the right Effect when the left fails. 
local function zip(left, right)
	return function()
		local leftResult = left()
		if leftResult.type == "err" then
			return leftResult
		end
		local rightResult = right()
		return if rightResult.type == "err" then rightResult else ok({ leftResult.value, rightResult.value })
	end
end
--* Runs left-to-right and stops at the first Err. 
local function all(effects)
	return function()
		local values = {}
		for _, effect in effects do
			local result = effect()
			if result.type == "err" then
				return result
			end
			local _value = result.value
			table.insert(values, _value)
		end
		return ok(values)
	end
end
--* Runs a finalizer after success, typed failure, or a thrown defect. 
local function ensuring(effect, finalizer)
	return function()
		local _exitType, _returns = TS.try(function()
			return TS.TRY_RETURN, { effect() }
		end, nil, function()
			finalizer()
		end)
		if _exitType then
			return unpack(_returns)
		end
	end
end
--* Acquires a resource, uses it, and always finalizes it after successful acquisition. 
local function acquireUseRelease(acquire, use, release)
	return function()
		local acquired = acquire()
		if acquired.type == "err" then
			return acquired
		end
		local _exitType, _returns = TS.try(function()
			return TS.TRY_RETURN, { use(acquired.value)() }
		end, nil, function()
			release(acquired.value)()
		end)
		if _exitType then
			return unpack(_returns)
		end
	end
end
local function lift(operation)
	return function(...)
		local arguments_ = { ... }
		return sync(function()
			return operation(unpack(arguments_))
		end)
	end
end
local function liftResult(operation)
	return function(...)
		local arguments_ = { ... }
		return tryResult(function()
			return operation(unpack(arguments_))
		end)
	end
end
local function mapWith(transform)
	return function(effect)
		return map(effect, transform)
	end
end
local function mapErrWith(transform)
	return function(effect)
		return mapErr(effect, transform)
	end
end
local function flatMapWith(transform)
	return function(effect)
		return flatMap(effect, transform)
	end
end
local function recoverWith(recovery)
	return function(effect)
		return recover(effect, recovery)
	end
end
local function orElseWith(recovery)
	return function(effect)
		return orElse(effect, recovery)
	end
end
local Effect = {
	succeed = succeed,
	fail = fail,
	fromResult = fromResult,
	sync = sync,
	try = tryEffect,
	tryResult = tryResult,
	suspend = suspend,
	run = run,
	map = map,
	mapErr = mapErr,
	flatMap = flatMap,
	recover = recover,
	orElse = orElse,
	tap = tap,
	tapErr = tapErr,
	zip = zip,
	all = all,
	ensuring = ensuring,
	acquireUseRelease = acquireUseRelease,
	lift = lift,
	liftResult = liftResult,
	mapWith = mapWith,
	mapErrWith = mapErrWith,
	flatMapWith = flatMapWith,
	recoverWith = recoverWith,
	orElseWith = orElseWith,
}
return {
	succeed = succeed,
	fail = fail,
	fromResult = fromResult,
	sync = sync,
	tryEffect = tryEffect,
	tryResult = tryResult,
	suspend = suspend,
	run = run,
	map = map,
	mapErr = mapErr,
	flatMap = flatMap,
	recover = recover,
	orElse = orElse,
	tap = tap,
	tapErr = tapErr,
	zip = zip,
	all = all,
	ensuring = ensuring,
	acquireUseRelease = acquireUseRelease,
	lift = lift,
	liftResult = liftResult,
	mapWith = mapWith,
	mapErrWith = mapErrWith,
	flatMapWith = flatMapWith,
	recoverWith = recoverWith,
	orElseWith = orElseWith,
	Effect = Effect,
}
