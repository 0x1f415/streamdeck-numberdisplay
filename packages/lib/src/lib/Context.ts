import InInfo from './inInfo';

import Events, { DidReceiveSettingsEvent } from './Events';
import { Typed as Emittery } from 'emittery';

interface ReceivedEvents<S> {
	didReceiveSettings: DidReceiveSettingsEvent<S>;
	// TODO enumerate and write interfaces for all the events
}

export default class Context<S> extends Emittery<ReceivedEvents<S>> {
	constructor(
		public readonly inInfo: InInfo,
		private readonly socket: WebSocket
	) {
		super();
		socket.onmessage = e => {
			const data = e.data;
			this.emit(data.event, data);
		};
	}

	protected sendMessage(data: Events<S>) {
		this.socket.send(JSON.stringify(data));
	}

	setSettings(settings: S) {
		this.sendMessage({
			event: 'sendSettings',
			context: '???', // where do I get the context
			payload: settings
		});
	}
}
