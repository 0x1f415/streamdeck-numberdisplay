/**
 * StreamDeck object containing all required code to establish
 * communication with SD-Software and the Property Inspector
 */

export default class StreamDeck {
	private init() {
		// *** PRIVATE ***

		var inPort,
			letUUID,
			inMessageType,
			inApplicationInfo,
			inActionInfo,
			websocket = null;

		var events = ELGEvents.eventEmitter();
		var logger = SDDebug.logger();

		function showVars() {
			console.debug('---- showVars');
			console.debug('- port', inPort);
			console.debug('- uuid', inUUID);
			console.debug('- messagetype', inMessageType);
			console.debug('- info', inApplicationInfo);
			console.debug('- inActionInfo', inActionInfo);
			console.debug('----< showVars');
		}

		function connect(args) {
			inPort = args[0];
			inUUID = args[1];
			inMessageType = args[2];
			inApplicationInfo = Utils.parseJson(args[3]);
			inActionInfo =
				args[4] !== 'undefined' ? Utils.parseJson(args[4]) : args[4];

			/** Debug variables */
			if (debug) {
				showVars();
			}

			const lang = Utils.getProp(
				inApplicationInfo,
				'application.language',
				false
			);
			if (lang) {
				loadLocalization(
					lang,
					inMessageType === 'registerPropertyInspector' ? '../' : './',
					function () {
						events.emit('localizationLoaded', { language: lang });
					}
				);
			}

			/** restrict the API to what's possible
			 * within Plugin or Property Inspector
			 * <unused for now>
			 */
			// $SD.api = SDApi[inMessageType];

			if (websocket) {
				websocket.close();
				websocket = null;
			}

			websocket = new WebSocket('ws://127.0.0.1:' + inPort);

			websocket.onopen = function () {
				var json = {
					event: inMessageType,
					uuid: inUUID
				};

				// console.log('***************', inMessageType + "  websocket:onopen", inUUID, json);

				websocket.sendJSON(json);
				$SD.uuid = inUUID;
				$SD.actionInfo = inActionInfo;
				$SD.applicationInfo = inApplicationInfo;
				$SD.messageType = inMessageType;
				$SD.connection = websocket;

				instance.emit('connected', {
					connection: websocket,
					port: inPort,
					uuid: inUUID,
					actionInfo: inActionInfo,
					applicationInfo: inApplicationInfo,
					messageType: inMessageType
				});
			};

			websocket.onerror = function (evt) {
				console.warn('WEBOCKET ERROR', evt, evt.data);
			};

			websocket.onclose = function (evt) {
				// Websocket is closed
				var reason = WEBSOCKETERROR(evt);
				console.warn('[STREAMDECK]***** WEBOCKET CLOSED **** reason:', reason);
			};

			websocket.onmessage = function (evt) {
				var jsonObj = Utils.parseJson(evt.data),
					m;

				// console.log('[STREAMDECK] websocket.onmessage ... ', jsonObj.event, jsonObj);

				if (!jsonObj.hasOwnProperty('action')) {
					m = jsonObj.event;
					// console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[common.js]onmessage:', m);
				} else {
					switch (inMessageType) {
						case 'registerPlugin':
							m = jsonObj['action'] + '.' + jsonObj['event'];
							break;
						case 'registerPropertyInspector':
							m = 'sendToPropertyInspector';
							break;
						default:
							console.log(
								'%c%s',
								'color: white; background: red; font-size: 12px;',
								'[STREAMDECK] websocket.onmessage +++++++++  PROBLEM ++++++++'
							);
							console.warn('UNREGISTERED MESSAGETYPE:', inMessageType);
					}
				}

				if (m && m !== '') events.emit(m, jsonObj);
			};

			instance.connection = websocket;
		}

		return {
			// *** PUBLIC ***

			uuid: inUUID,
			on: events.on,
			emit: events.emit,
			connection: websocket,
			connect: connect,
			api: null,
			logger: logger
		};
	}

	getInstance() {
		return this.init();
	}
}
