/** SDDebug
 * Utility to log the JSON structure of an incoming object
 */

export default class SDDebug {
	logger(name: string) {
		const logEvent = (jsn: any) => {
			console.log('____SDDebug.logger.logEvent');
			console.log(jsn);
			console.debug('-->> Received Obj:', jsn);
			console.debug('jsonObj', jsn);
			console.debug('event', jsn['event']);
			console.debug('actionType', jsn['actionType']);
			console.debug('settings', jsn['settings']);
			console.debug('coordinates', jsn['coordinates']);
			console.debug('---');
		};

		const logSomething = (jsn: any) =>
			console.log('____SDDebug.logger.logSomething');

		return { logEvent, logSomething };
	}
}
