-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local exports = {}
for _k, _v in TS.import(script, script, "collection") or {} do
	exports[_k] = _v
end
exports.Effect = TS.import(script, script, "effect").Effect
for _k, _v in TS.import(script, script, "function") or {} do
	exports[_k] = _v
end
local _match = TS.import(script, script, "match")
exports.absurd = _match.absurd
exports.match = _match.match
local _option = TS.import(script, script, "option")
exports.Option = _option.Option
exports.none = _option.none
exports.some = _option.some
for _k, _v in TS.import(script, script, "predicate") or {} do
	exports[_k] = _v
end
local _result = TS.import(script, script, "result")
exports.Result = _result.Result
exports.err = _result.err
exports.ok = _result.ok
for _k, _v in TS.import(script, script, "roblox") or {} do
	exports[_k] = _v
end
exports.TaskResult = TS.import(script, script, "task-result").TaskResult
return exports
