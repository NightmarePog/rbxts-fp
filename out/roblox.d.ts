export type Cleanup = () => void;
export declare function setAttributes<T extends Instance>(value: AttributeValue, ...attributeNames: ReadonlyArray<string>): (instance: T) => T;
export declare function clearAttributes<T extends Instance>(...attributeNames: ReadonlyArray<string>): (instance: T) => T;
/** Normalizes a Roblox connection to the cleanup-function convention. */
export declare function connectionCleanup(connection: RBXScriptConnection): Cleanup;
/** Connects a signal and returns an idempotent cleanup function. */
export declare function connect<Listener extends Callback>(signal: RBXScriptSignal<Listener>, listener: Listener): Cleanup;
