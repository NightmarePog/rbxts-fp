-- Compiled with roblox-ts v3.0.0
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
	connectionCleanup = connectionCleanup,
	connect = connect,
}
