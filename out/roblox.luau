-- Compiled with roblox-ts v3.0.0
local function setAttributes(value, ...)
	local attributeNames = { ... }
	return function(instance)
		for _, attributeName in attributeNames do
			instance:SetAttribute(attributeName, value)
		end
		return instance
	end
end
local function clearAttributes(...)
	local attributeNames = { ... }
	return function(instance)
		for _, attributeName in attributeNames do
			instance:SetAttribute(attributeName, nil)
		end
		return instance
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
	setAttributes = setAttributes,
	clearAttributes = clearAttributes,
	connectionCleanup = connectionCleanup,
	connect = connect,
}
