export type Cleanup = () => void;

export type AttributeArguments<Arguments extends readonly unknown[]> = Arguments extends readonly []
	? readonly []
	: Arguments extends readonly [infer Name, infer Value, ...infer Rest]
	? [Name] extends [string]
		? [Value] extends [AttributeValue | undefined]
			? readonly [Name, Value, ...AttributeArguments<Rest>]
			: never
		: never
	: never;

export function setAttributeValues<T extends Instance, Arguments extends readonly unknown[]>(
	instance: T,
	...attributes: Arguments & AttributeArguments<Arguments>
): T {
	for (let index = 0; index < attributes.size(); index += 2)
		instance.SetAttribute(attributes[index] as string, attributes[index + 1] as AttributeValue | undefined);
	return instance;
}

export function clearAttributeValues<T extends Instance>(instance: T, ...attributeNames: ReadonlyArray<string>): T {
	for (const attributeName of attributeNames) instance.SetAttribute(attributeName, undefined);
	return instance;
}

export function setAttributeValue<T extends Instance>(
	instance: T,
	value: AttributeValue,
	...attributeNames: ReadonlyArray<string>
): T {
	for (const attributeName of attributeNames) instance.SetAttribute(attributeName, value);
	return instance;
}

export function setAttributes<T extends Instance>(
	value: AttributeValue,
	...attributeNames: ReadonlyArray<string>
): (instance: T) => T {
	return (instance) => setAttributeValue(instance, value, ...attributeNames);
}

export function clearAttributes<T extends Instance>(...attributeNames: ReadonlyArray<string>): (instance: T) => T {
	return (instance) => clearAttributeValues(instance, ...attributeNames);
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
