export type Cleanup = () => void;
export type AttributeArguments<Arguments extends readonly unknown[]> = Arguments extends readonly [] ? readonly [] : Arguments extends readonly [infer Name, infer Value, ...infer Rest] ? [Name] extends [string] ? [Value] extends [AttributeValue | undefined] ? readonly [Name, Value, ...AttributeArguments<Rest>] : never : never : never;
export declare function setAttributeValues<T extends Instance, Arguments extends readonly unknown[]>(instance: T, ...attributes: Arguments & AttributeArguments<Arguments>): T;
export declare function clearAttributeValues<T extends Instance>(instance: T, ...attributeNames: ReadonlyArray<string>): T;
export declare function setAttributeValue<T extends Instance>(instance: T, value: AttributeValue, ...attributeNames: ReadonlyArray<string>): T;
export declare function setAttributes<T extends Instance>(value: AttributeValue, ...attributeNames: ReadonlyArray<string>): (instance: T) => T;
export declare function clearAttributes<T extends Instance>(...attributeNames: ReadonlyArray<string>): (instance: T) => T;
/** Normalizes a Roblox connection to the cleanup-function convention. */
export declare function connectionCleanup(connection: RBXScriptConnection): Cleanup;
/** Connects a signal and returns an idempotent cleanup function. */
export declare function connect<Listener extends Callback>(signal: RBXScriptSignal<Listener>, listener: Listener): Cleanup;
