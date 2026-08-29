export type Cleanup = () => void;

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
