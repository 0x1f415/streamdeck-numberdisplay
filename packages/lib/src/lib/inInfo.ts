export interface DeviceMetadata {
	/** An opaque value identifying the device. */
	id: string;
	/** The name of the device set by the user. */
	name: string;
	/** The number of columns and rows of keys that the device owns. */
	size: {
		columns: number;
		rows: number;
	};
	/**
	 * Type of device.
	 * Possible values are kESDSDKDeviceType_StreamDeck (0), kESDSDKDeviceType_StreamDeckMini (1), kESDSDKDeviceType_StreamDeckXL (2) and kESDSDKDeviceType_StreamDeckMobile (3).
	 * This parameter parameter won't be present if you never plugged a device to the computer.
	 */
	type: number;
}

export default interface InInfo {
	/** A json object containing information about the application. */
	application: {
		/**
		 * In which language the Stream Deck application is running.
		 * Possible values are en, fr, de, es, ja, zh_CN.
		 */
		language: string;
		/**
		 * On which platform the Stream Deck application is running.
		 * Possible values are kESDSDKApplicationInfoPlatformMac ("mac") and kESDSDKApplicationInfoPlatformWindows ("windows").
		 */
		platform: string;
		/** The Stream Deck application version. */
		version: string;
	};
	/** A json object containing information about the plugin. */
	plugin: {
		/** The plugin version as written in the manifest.json. */
		version: string;
	};
	/** Pixel ratio value to indicate if the Stream Deck application is running on a HiDPI screen. */
	devicePixelRatio: number;
	/** A json array containing information about the devices. */
	devices: DeviceMetadata[];
}
