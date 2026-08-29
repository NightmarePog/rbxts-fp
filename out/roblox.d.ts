export type Cleanup = () => void;
/** Normalizes a Roblox connection to the cleanup-function convention. */
export declare function connectionCleanup(connection: RBXScriptConnection): Cleanup;
/** Connects a signal and returns an idempotent cleanup function. */
export declare function connect<Listener extends Callback>(signal: RBXScriptSignal<Listener>, listener: Listener): Cleanup;
