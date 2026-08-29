-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _option = TS.import(script, script.Parent, "option")
local none = _option.none
local some = _option.some
local function filterMap(values, transform)
	local output = {}
	for index = 0, #values - 1 do
		local transformed = transform(values[index + 1], index)
		if transformed.type == "some" then
			local _value = transformed.value
			table.insert(output, _value)
		end
	end
	return output
end
local function findMap(values, transform)
	for index = 0, #values - 1 do
		local transformed = transform(values[index + 1], index)
		if transformed.type == "some" then
			return transformed
		end
	end
	return none()
end
local function partition(values, predicate)
	local matched = {}
	local unmatched = {}
	for _, value in values do
		local _exp = (if predicate(value) then matched else unmatched)
		table.insert(_exp, value)
	end
	return { matched, unmatched }
end
local function groupBy(values, keyOf)
	local groups = {}
	for _, value in values do
		local key = keyOf(value)
		local group = groups[key]
		if group ~= nil then
			table.insert(group, value)
		else
			local _arg1 = { value }
			groups[key] = _arg1
		end
	end
	return groups
end
--* Indexes values by key. A later value replaces an earlier duplicate key. 
local function keyBy(values, keyOf)
	local keyed = {}
	for _, value in values do
		local _arg0 = keyOf(value)
		keyed[_arg0] = value
	end
	return keyed
end
local function scan(values, initial, reducer)
	local states = {}
	local state = initial
	for index = 0, #values - 1 do
		state = reducer(state, values[index + 1], index)
		local _state = state
		table.insert(states, _state)
	end
	return states
end
local function zipWith(left, right, combine)
	local length = math.min(#left, #right)
	local output = {}
	do
		local index = 0
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				index += 1
			else
				_shouldIncrement = true
			end
			if not (index < length) then
				break
			end
			local _arg0 = combine(left[index + 1], right[index + 1], index)
			table.insert(output, _arg0)
		end
	end
	return output
end
--* Keeps the first value encountered for each key. 
local function uniqueBy(values, keyOf)
	local seen = {}
	local output = {}
	for _, value in values do
		local key = keyOf(value)
		if not (seen[key] ~= nil) then
			seen[key] = true
			table.insert(output, value)
		end
	end
	return output
end
local function sumBy(values, valueOf)
	local total = 0
	for _, value in values do
		total += valueOf(value)
	end
	return total
end
--* Returns the first minimum, or None when the input is empty. 
local function minBy(values, valueOf)
	if #values == 0 then
		return none()
	end
	local best = values[1]
	local bestValue = valueOf(best)
	for index = 1, #values - 1 do
		local candidate = values[index + 1]
		local candidateValue = valueOf(candidate)
		if candidateValue < bestValue then
			best = candidate
			bestValue = candidateValue
		end
	end
	return some(best)
end
--* Returns the first maximum, or None when the input is empty. 
local function maxBy(values, valueOf)
	if #values == 0 then
		return none()
	end
	local best = values[1]
	local bestValue = valueOf(best)
	for index = 1, #values - 1 do
		local candidate = values[index + 1]
		local candidateValue = valueOf(candidate)
		if candidateValue > bestValue then
			best = candidate
			bestValue = candidateValue
		end
	end
	return some(best)
end
local function filterMapWith(transform)
	return function(values)
		return filterMap(values, transform)
	end
end
local function findMapWith(transform)
	return function(values)
		return findMap(values, transform)
	end
end
local function partitionWith(predicate)
	return function(values)
		return partition(values, predicate)
	end
end
local function groupByWith(keyOf)
	return function(values)
		return groupBy(values, keyOf)
	end
end
local function keyByWith(keyOf)
	return function(values)
		return keyBy(values, keyOf)
	end
end
local function scanWith(initial, reducer)
	return function(values)
		return scan(values, initial, reducer)
	end
end
local function zipWithRight(right, combine)
	return function(left)
		return zipWith(left, right, combine)
	end
end
local function uniqueByWith(keyOf)
	return function(values)
		return uniqueBy(values, keyOf)
	end
end
local function sumByWith(valueOf)
	return function(values)
		return sumBy(values, valueOf)
	end
end
local function minByWith(valueOf)
	return function(values)
		return minBy(values, valueOf)
	end
end
local function maxByWith(valueOf)
	return function(values)
		return maxBy(values, valueOf)
	end
end
--* Data-last collection operations intended for use in `pipe`. 
local Collection = {
	filterMap = filterMapWith,
	findMap = findMapWith,
	partition = partitionWith,
	groupBy = groupByWith,
	keyBy = keyByWith,
	scan = scanWith,
	zipWith = zipWithRight,
	uniqueBy = uniqueByWith,
	sumBy = sumByWith,
	minBy = minByWith,
	maxBy = maxByWith,
}
return {
	filterMap = filterMap,
	findMap = findMap,
	partition = partition,
	groupBy = groupBy,
	keyBy = keyBy,
	scan = scan,
	zipWith = zipWith,
	uniqueBy = uniqueBy,
	sumBy = sumBy,
	minBy = minBy,
	maxBy = maxBy,
	filterMapWith = filterMapWith,
	findMapWith = findMapWith,
	partitionWith = partitionWith,
	groupByWith = groupByWith,
	keyByWith = keyByWith,
	scanWith = scanWith,
	zipWithRight = zipWithRight,
	uniqueByWith = uniqueByWith,
	sumByWith = sumByWith,
	minByWith = minByWith,
	maxByWith = maxByWith,
	Collection = Collection,
}
