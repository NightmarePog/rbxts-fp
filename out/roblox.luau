-- Compiled with roblox-ts v3.0.0
local function setAttributeValues(instance, ...)
	local attributes = { ... }
	for index = 0, #attributes - 1, 2 do
		instance:SetAttribute(attributes[index + 1], attributes[index + 2])
	end
	return instance
end
local function clearAttributeValues(instance, ...)
	local attributeNames = { ... }
	for _, attributeName in attributeNames do
		instance:SetAttribute(attributeName, nil)
	end
	return instance
end
local function setAttributeValue(instance, value, ...)
	local attributeNames = { ... }
	for _, attributeName in attributeNames do
		instance:SetAttribute(attributeName, value)
	end
	return instance
end
local function setAttributes(value, ...)
	local attributeNames = { ... }
	return function(instance)
		return setAttributeValue(instance, value, unpack(attributeNames))
	end
end
local function clearAttributes(...)
	local attributeNames = { ... }
	return function(instance)
		return clearAttributeValues(instance, unpack(attributeNames))
	end
end
--* Normalizes a Roblox connection to the cleanup-function convention. 
local function connectionCleanup(connection)
	return function()
		if connection.Connected then
			connection:Disconnect()
		end
	end
end
--* Connects a signal and returns an idempotent cleanup function. 
local function connect(signal, listener)
	return connectionCleanup(signal:Connect(listener))
end
return {
	setAttributeValues = setAttributeValues,
	clearAttributeValues = clearAttributeValues,
	setAttributeValue = setAttributeValue,
	setAttributes = setAttributes,
	clearAttributes = clearAttributes,
	connectionCleanup = connectionCleanup,
	connect = connect,
}
