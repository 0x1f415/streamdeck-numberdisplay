import Context from './lib/Context';

class PluginContext<S> extends Context<S> {}

export default function initializePlugin<S>(
	cb: (ctx: PluginContext<S>) => void
) {
	(window as any).connectElgatoStreamDeckSocket = (
		inPort: string,
		inPluginUUID: string,
		inRegisterEvent: string,
		inInfo: string
	) => {
		const websocket = new WebSocket('ws://localhost:' + inPort);
		websocket.onopen = function () {
			websocket.send(
				JSON.stringify({
					event: inRegisterEvent,
					uuid: inPluginUUID
				})
			);
		};
		cb(new PluginContext(JSON.parse(inInfo), websocket));
	};
}
