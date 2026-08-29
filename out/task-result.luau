-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _result = TS.import(script, script.Parent, "result")
local err = _result.err
local ok = _result.ok
local Result = _result.Result
--[[
	*
	 * A cold asynchronous operation with a typed expected-failure channel.
	 *
	 * Calling the function starts fresh work. Expected failures resolve as Err;
	 * unexpected failures and cancellation remain native Promise behavior.
	 
]]
local function succeed(value)
	return function()
		return TS.Promise.resolve(ok(value))
	end
end
local function fail(errorValue)
	return function()
		return TS.Promise.resolve(err(errorValue))
	end
end
local function fromResult(result)
	return function()
		return TS.Promise.resolve(result)
	end
end
--* Lifts a synchronous Effect; thrown defects become native Promise rejections. 
local function fromEffect(effect)
	return function()
		return TS.Promise.try(effect)
	end
end
--* Converts a Promise rejection into a typed error only through the explicit mapper. 
local function fromPromise(factory, onRejected)
	return function()
		return factory():andThen(function(value)
			return ok(value)
		end, function(reason)
			return err(onRejected(reason))
		end)
	end
end
local function run(task)
	return task()
end
local function map(task, transform)
	return function()
		return task():andThen(function(result)
			return if result.type == "ok" then ok(transform(result.value)) else result
		end)
	end
end
local function mapErr(task, transform)
	return function()
		return task():andThen(function(result)
			return if result.type == "err" then err(transform(result.error)) else result
		end)
	end
end
local function flatMap(task, transform)
	return function()
		-- The explicit output argument teaches Promise.andThen that both Result
		-- error channels widen into the same union without runtime adapters.
		return task():andThen(function(result)
			return if result.type == "ok" then transform(result.value)() else result
		end)
	end
end
local function recover(task, recovery)
	return function()
		return task():andThen(function(result)
			return Result.recover(result, recovery)
		end)
	end
end
local function orElse(task, recovery)
	return function()
		-- This is the recovery-side equivalent of flatMap's explicit widening.
		return task():andThen(function(result)
			return if result.type == "ok" then result else recovery(result.error)()
		end)
	end
end
local function tap(task, effect)
	return function()
		return task():andThen(function(result)
			return Result.tap(result, effect)
		end)
	end
end
local function tapErr(task, effect)
	return function()
		return task():andThen(function(result)
			return Result.tapErr(result, effect)
		end)
	end
end
--* Starts both tasks together. Result errors prefer the left task. 
local function zip(left, right)
	return function()
		return TS.Promise.all({ left(), right() }):andThen(function(_param)
			local leftResult = _param[1]
			local rightResult = _param[2]
			return Result.zip(leftResult, rightResult)
		end)
	end
end
--* Starts every task together and returns the first Err in input order. 
local function all(tasks)
	return function()
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#tasks)
		local _callback = function(task)
			return task()
		end
		for _k, _v in tasks do
			_newValue[_k] = _callback(_v, _k - 1, tasks)
		end
		-- ▲ ReadonlyArray.map ▲
		local promises = _newValue
		return TS.Promise.all(promises):andThen(function(results)
			local values = {}
			for _, result in results do
				if result.type == "err" then
					return result
				end
				local _value = result.value
				table.insert(values, _value)
			end
			return ok(values)
		end)
	end
end
local function retryAttempt(task, retriesRemaining, shouldRetry, attempt, delaySeconds)
	return task():andThen(function(result)
		if result.type == "ok" or retriesRemaining <= 0 or not shouldRetry(result.error, attempt) then
			return result
		end
		if delaySeconds ~= nil then
			return TS.Promise.delay(delaySeconds):andThen(function()
				return retryAttempt(task, retriesRemaining - 1, shouldRetry, attempt + 1, delaySeconds)
			end)
		end
		return retryAttempt(task, retriesRemaining - 1, shouldRetry, attempt + 1)
	end)
end
--* Retries typed Err results. `retries` counts additional attempts after the first. 
local function retry(task, retries, shouldRetry)
	if shouldRetry == nil then
		shouldRetry = function()
			return true
		end
	end
	return function()
		return retryAttempt(task, retries, shouldRetry, 1)
	end
end
--* Retries typed Err results after a Promise-native cancellable delay. 
local function retryWithDelay(task, retries, delaySeconds, shouldRetry)
	if shouldRetry == nil then
		shouldRetry = function()
			return true
		end
	end
	return function()
		return retryAttempt(task, retries, shouldRetry, 1, delaySeconds)
	end
end
--[[
	*
	 * Cancels the source task and resolves with a typed timeout error when the
	 * deadline wins. Source rejections remain rejections.
	 
]]
local function timeout(task, seconds, onTimeout)
	return function()
		return TS.Promise.new(function(resolve, reject, onCancel)
			local source = task()
			local timer = TS.Promise.delay(seconds)
			local settled = false
			onCancel(function()
				source:cancel()
				timer:cancel()
			end)
			source:andThen(function(result)
				if settled then
					return nil
				end
				settled = true
				timer:cancel()
				resolve(result)
			end, function(reason)
				if settled then
					return nil
				end
				settled = true
				timer:cancel()
				reject(reason)
			end)
			timer:andThen(function()
				if settled then
					return nil
				end
				settled = true
				source:cancel()
				resolve(err(onTimeout()))
			end)
		end)
	end
end
local function mapWith(transform)
	return function(task)
		return map(task, transform)
	end
end
local function mapErrWith(transform)
	return function(task)
		return mapErr(task, transform)
	end
end
local function flatMapWith(transform)
	return function(task)
		return flatMap(task, transform)
	end
end
local function recoverWith(recovery)
	return function(task)
		return recover(task, recovery)
	end
end
local function orElseWith(recovery)
	return function(task)
		return orElse(task, recovery)
	end
end
local TaskResult = {
	succeed = succeed,
	fail = fail,
	fromResult = fromResult,
	fromEffect = fromEffect,
	fromPromise = fromPromise,
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
	retry = retry,
	retryWithDelay = retryWithDelay,
	timeout = timeout,
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
	fromEffect = fromEffect,
	fromPromise = fromPromise,
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
	retry = retry,
	retryWithDelay = retryWithDelay,
	timeout = timeout,
	mapWith = mapWith,
	mapErrWith = mapErrWith,
	flatMapWith = flatMapWith,
	recoverWith = recoverWith,
	orElseWith = orElseWith,
	TaskResult = TaskResult,
}
