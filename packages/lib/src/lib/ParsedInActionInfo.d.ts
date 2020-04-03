type opaqueValue = string;

export default interface ParsedInActionInfo {
	/** The action's unique identifier. If your plugin supports multiple actions, you should use this value to see which action was triggered. */
	action: string;
	/** An opaque value identifying the instance's action. You will need to pass this opaque value to several APIs like the setTitle API. */
	context: opaqueValue;
	/** An opaque value identifying the device. */
	device: opaqueValue;
	payload: {
		/** This json object contains data that you can set and are stored persistently. */
		settings: object;
		/** The coordinates of the action triggered. */
		coordinates: {
			column: 2;
			row: 1;
		};
	};
}
