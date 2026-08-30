export type Cleanup = () => void;

export function setAttributes<T extends Instance>(
	value: AttributeValue,
	...attributeNames: ReadonlyArray<string>
): (instance: T) => T {
	return (instance) => {
		for (const attributeName of attributeNames) instance.SetAttribute(attributeName, value);
		return instance;
	};
}

export function clearAttributes<T extends Instance>(...attributeNames: ReadonlyArray<string>): (instance: T) => T {
	return (instance) => {
		for (const attributeName of attributeNames) instance.SetAttribute(attributeName, undefined);
		return instance;
	};
}

/** Normalizes a Roblox connection to the cleanup-function convention. */
export function connectionCleanup(connection: RBXScriptConnection): Cleanup {
	return () => {
		if (connection.Connected) connection.Disconnect();
	};
}

/** Connects a signal and returns an idempotent cleanup function. */
export function connect<Listener extends Callback>(signal: RBXScriptSignal<Listener>, listener: Listener): Cleanup {
	return connectionCleanup(signal.Connect(listener));
}
