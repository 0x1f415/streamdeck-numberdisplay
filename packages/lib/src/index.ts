import StreamDeck from './lib/StreamDeck';

// don't change this to let or const, because we rely on var's hoisting
// eslint-disable-next-line no-use-before-define, no-var
var $localizedStrings = $localizedStrings || {},
	REMOTESETTINGS = REMOTESETTINGS || {},
	// eslint-disable-next-line no-unused-vars
	isQT = navigator.appVersion.includes('QtWebEngine'),
	debug = debug || false,
	debugLog = function () {},
	MIMAGECACHE = MIMAGECACHE || {};

// Create a wrapper to allow passing JSON to the socket
WebSocket.prototype.sendJSON = function (jsn, log) {
	if (log) {
		console.log('SendJSON', this, jsn);
	}
	// if (this.readyState) {
	this.send(JSON.stringify(jsn));
	// }
};

/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
// String.prototype.lox = function () {
// 	var a = String(this);
// 	try {
// 		a = $localizedStrings[a] || a;
// 	} catch (b) {}
// 	return a;
// };

/*
 * connectElgatoStreamDeckSocket
 * This is the first function StreamDeck Software calls, when
 * establishing the connection to the plugin or the Property Inspector
 * @param inPort - The socket's port to communicate with StreamDeck software.
 * @param inUUID - A unique identifier, which StreamDeck uses to communicate with the plugin
 * @param inMessageType - Identifies, if the event is meant for the property inspector or the plugin.
 * @param inApplicationInfo - Information about the host (StreamDeck) application
 * @param inActionInfo - Context is an internal identifier used to communicate to the host application.
 */

// eslint-disable-next-line no-unused-vars
window.connectElgatoStreamDeckSocket = function () {
	StreamDeck.getInstance().connect(arguments);
	window.$SD.api = Object.assign(
		{ send: SDApi.send },
		SDApi.common,
		SDApi[inMessageType]
	);
};

// eslint-disable-next-line no-unused-vars
function initializeControlCenterClient() {
	const settings = Object.assign(REMOTESETTINGS || {}, { debug: false });
	var $CC = new ControlCenterClient(settings);
	window['$CC'] = $CC;
	return $CC;
}

/** ELGEvents
 * Publish/Subscribe pattern to quickly signal events to
 * the plugin, property inspector and data.
 */

const ELGEvents = {
	eventEmitter: function (name, fn) {
		const eventList = new Map();

		const on = (name, fn) => {
			if (!eventList.has(name)) eventList.set(name, ELGEvents.pubSub());

			return eventList.get(name).sub(fn);
		};

		const has = name => eventList.has(name);

		const emit = (name, data) =>
			eventList.has(name) && eventList.get(name).pub(data);

		return Object.freeze({ on, has, emit, eventList });
	},

	pubSub: function pubSub() {
		const subscribers = new Set();

		const sub = fn => {
			subscribers.add(fn);
			return () => {
				subscribers.delete(fn);
			};
		};

		const pub = data => subscribers.forEach(fn => fn(data));
		return Object.freeze({ pub, sub });
	}
};

/**
 * This is the instance of the StreamDeck object.
 * There's only one StreamDeck object, which carries
 * connection parameters and handles communication
 * to/from the software's PluginManager.
 */

window.$SD = StreamDeck.getInstance();
window.$SD.api = SDApi;

function WEBSOCKETERROR(evt) {
	// Websocket is closed
	var reason = '';
	if (evt.code === 1000) {
		reason =
			'Normal Closure. The purpose for which the connection was established has been fulfilled.';
	} else if (evt.code === 1001) {
		reason =
			'Going Away. An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
	} else if (evt.code === 1002) {
		reason =
			'Protocol error. An endpoint is terminating the connection due to a protocol error';
	} else if (evt.code === 1003) {
		reason =
			"Unsupported Data. An endpoint received a type of data it doesn't support.";
	} else if (evt.code === 1004) {
		reason =
			'--Reserved--. The specific meaning might be defined in the future.';
	} else if (evt.code === 1005) {
		reason = 'No Status. No status code was actually present.';
	} else if (evt.code === 1006) {
		reason =
			'Abnormal Closure. The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
	} else if (evt.code === 1007) {
		reason =
			'Invalid frame payload data. The connection was closed, because the received data was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629]).';
	} else if (evt.code === 1008) {
		reason =
			'Policy Violation. The connection was closed, because current message data "violates its policy". This reason is given either if there is no other suitable reason, or if there is a need to hide specific details about the policy.';
	} else if (evt.code === 1009) {
		reason =
			'Message Too Big. Connection closed because the message is too big for it to process.';
	} else if (evt.code === 1010) {
		// Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
		reason =
			"Mandatory Ext. Connection is terminated the connection because the server didn't negotiate one or more extensions in the WebSocket handshake. <br /> Mandatory extensions were: " +
			evt.reason;
	} else if (evt.code === 1011) {
		reason =
			'Internl Server Error. Connection closed because it encountered an unexpected condition that prevented it from fulfilling the request.';
	} else if (evt.code === 1015) {
		reason =
			"TLS Handshake. The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
	} else {
		reason = 'Unknown reason';
	}

	return reason;
}

const SOCKETERRORS = {
	'0': 'The connection has not yet been established',
	'1': 'The connection is established and communication is possible',
	'2': 'The connection is going through the closing handshake',
	'3': 'The connection has been closed or could not be opened'
};
