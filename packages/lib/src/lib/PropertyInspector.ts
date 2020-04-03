import InInfo from './inInfo';

export default class PropertyInspector {
	constructor() {
		(window as any).connectElgatoStreamDeckSocket = (
			inPort: string,
			inPropertyInspectorUUID: string,
			inRegisterEvent: string,
			inInfo: InInfo,
			inActionInfo: string
		) => {
			const websocket = new WebSocket('ws://localhost:' + inPort);
			websocket.onopen = function () {
				// WebSocket is connected, register the Property Inspector
				const json = {
					event: inRegisterEvent,
					uuid: inPropertyInspectorUUID
				};

				websocket.send(JSON.stringify(json));
			};
		};
	}
}
