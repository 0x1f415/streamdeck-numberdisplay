export interface Event {
	event: string;
	context: string;
}

export interface DidReceiveSettingsEvent<S> extends Event {
	event: 'didReceiveSettings';
	action: string;
	device: string;
	payload: {
		settings: S;
		coordinates: {
			column: number;
			row: number;
		};
		isInMultiAction: boolean;
	};
}

export interface SendSettingsEvent<S> extends Event {
	event: 'sendSettings';
	payload: S;
}

type Events<S> = DidReceiveSettingsEvent<S> | SendSettingsEvent<S>;

export default Events;
