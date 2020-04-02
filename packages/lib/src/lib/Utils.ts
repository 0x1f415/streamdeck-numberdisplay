// this class seems to be mostly a bunch of utility functions not directly related to
// streamdeck functionality. most of this file will probably be eventually removed
// or split into separate modules.

class Utils {
	sleep(milliseconds: number) {
		return new Promise(resolve => setTimeout(resolve, milliseconds));
	}
	isUndefined(value: unknown): value is undefined {
		return typeof value === 'undefined';
	}
	isObject(o: unknown): o is object {
		return (
			typeof o === 'object' &&
			o !== null &&
			o.constructor &&
			o.constructor === Object
		);
	}
	isPlainObject(o: unknown): o is object {
		return (
			typeof o === 'object' &&
			o !== null &&
			o.constructor &&
			o.constructor === Object
		);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isArray(value: unknown): value is Array<any> {
		return Array.isArray(value);
	}
	isNumber(value: unknown): value is number {
		return typeof value === 'number' && value !== null;
	}
	isInteger(value: unknown): value is number {
		return typeof value === 'number' && value === Number(value);
	}
	isString(value: unknown) {
		return typeof value === 'string';
	}
	isImage(value: unknown): value is HTMLImageElement {
		return value instanceof HTMLImageElement;
	}
	isCanvas(value: unknown): value is HTMLCanvasElement {
		return value instanceof HTMLCanvasElement;
	}
	isValue(
		value: unknown
	): value is number | string | null | undefined | symbol {
		return !this.isObject(value) && !this.isArray(value);
	}
	isNull(value: unknown): value is null {
		return value === null;
	}
	toInteger(value: number): number {
		const INFINITY = 1 / 0,
			MAX_INTEGER = 1.7976931348623157e308;
		if (!value) {
			return value === 0 ? value : 0;
		}
		value = Number(value);
		if (value === INFINITY || value === -INFINITY) {
			const sign = value < 0 ? -1 : 1;
			return sign * MAX_INTEGER;
		}
		return value === value ? value : 0;
	}

	minmax(v: number, min = 0, max = 100) {
		return Math.min(max, Math.max(min, v));
	}

	rangeToPercent(value: number, min: number, max: number) {
		return (value - min) / (max - min);
	}

	percentToRange(percent: number, min: number, max: number) {
		return (max - min) * percent + min;
	}

	setDebugOutput(debug: boolean) {
		if (debug) return console.log.bind(window.console);
		else
			return () => {
				return;
			};
	}

	randomComponentName(len = 6) {
		return `${this.randomLowerString(len)}-${this.randomLowerString(len)}`;
	}

	randomString(len = 8) {
		return Array.apply(0, Array(len))
			.map(function () {
				return (function (charset) {
					return charset.charAt(Math.floor(Math.random() * charset.length));
				})('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
			})
			.join('');
	}

	rs(len = 8) {
		return [...Array(len)]
			.map(() => (~~(Math.random() * 36)).toString(36))
			.join('');
	}

	randomLowerString(len = 8) {
		return Array.apply(0, Array(len))
			.map(function () {
				return (function (charset) {
					return charset.charAt(Math.floor(Math.random() * charset.length));
				})('abcdefghijklmnopqrstuvwxyz');
			})
			.join('');
	}

	capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	private measureTextCanvas?: HTMLCanvasElement;
	measureText(text: string, font: string) {
		const canvas =
			this.measureTextCanvas ||
			(this.measureTextCanvas = document.createElement('canvas'));
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Cannot get 2d context');
		ctx.font = font || 'bold 10pt system-ui';
		return ctx.measureText(text).width;
	}

	/** I have no idea what this does */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fixName(d: any, dName: any) {
		let i = 1;
		const base = dName;
		while (d[dName]) {
			dName = `${base} (${i})`;
			i++;
		}
		return dName;
	}

	isEmptyString(str: string) {
		return !str || str.length === 0;
	}

	isBlankString(str: string) {
		return !str || /^\s*$/.test(str);
	}

	log() {
		return;
	}
	private count = 0;
	counter() {
		return (this.count += 1);
	}
	getPrefix() {
		return this.prefix + this.counter();
	}

	private prefix = this.randomString() + '_';

	getUrlParameter(name: string) {
		const nameA = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
		const regex = new RegExp('[\\?&]' + nameA + '=([^&#]*)');
		const results = regex.exec(location.search.replace(/\/$/, ''));
		return results === null
			? null
			: decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	debounce(func: (...args: any[]) => any, wait = 100) {
		let timeout: number;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return function (this: any, ...args: any[]) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				func.apply(this, args);
			}, wait);
		};
	}

	getRandomColor() {
		// just a random color padded to 6 characters
		return (
			'#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0')
		);
	}

	/*
	Quick utility to lighten or darken a color (doesn't take color-drifting, etc. into account)
	Usage:
	fadeColor('#061261', 100); // will lighten the color
	fadeColor('#200867'), -100); // will darken the color
	*/
	fadeColor(col: string, amt: number) {
		const min = Math.min,
			max = Math.max;
		const num = parseInt(col.replace(/#/g, ''), 16);
		const r = min(255, max((num >> 16) + amt, 0));
		const g = min(255, max((num & 0x0000ff) + amt, 0));
		const b = min(255, max(((num >> 8) & 0x00ff) + amt, 0));
		return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
	}

	lerpColor(startColor: string, targetColor: string, amount: number) {
		const ah = parseInt(startColor.replace(/#/g, ''), 16);
		const ar = ah >> 16;
		const ag = (ah >> 8) & 0xff;
		const ab = ah & 0xff;
		const bh = parseInt(targetColor.replace(/#/g, ''), 16);
		const br = bh >> 16;
		const bg = (bh >> 8) & 0xff;
		const bb = bh & 0xff;
		const rr = ar + amount * (br - ar);
		const rg = ag + amount * (bg - ag);
		const rb = ab + amount * (bb - ab);

		return (
			'#' +
			(((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0)
				.toString(16)
				.slice(1)
				.toUpperCase()
		);
	}

	hexToRgb(hex: string) {
		const match = hex.replace(/#/, '').match(/.{1,2}/g);
		if (!match) throw new Error('Could not parse color');
		return {
			r: parseInt(match[0], 16),
			g: parseInt(match[1], 16),
			b: parseInt(match[2], 16)
		};
	}

	rgbToHex(r: number, g: number, b: number) {
		'#' +
			[r, g, b]
				.map(x => {
					return x.toString(16).padStart(2, '0');
				})
				.join('');
	}

	nscolorToRgb(rP: number, gP: number, bP: number) {
		return {
			r: Math.round(rP * 255),
			g: Math.round(gP * 255),
			b: Math.round(bP * 255)
		};
	}

	nsColorToHex(rP: number, gP: number, bP: number) {
		const c = this.nscolorToRgb(rP, gP, bP);
		return this.rgbToHex(c.r, c.g, c.b);
	}

	miredToKelvin(mired: number) {
		return Math.round(1e6 / mired);
	}

	kelvinToMired(kelvin: number, roundTo: number) {
		return roundTo
			? this.roundBy(Math.round(1e6 / kelvin), roundTo)
			: Math.round(1e6 / kelvin);
	}

	roundBy(num: number, x: number) {
		return Math.round((num - 10) / x) * x;
	}

	getBrightness(hexColor: string) {
		// http://www.w3.org/TR/AERT#color-contrast
		if (typeof hexColor === 'string' && hexColor.charAt(0) === '#') {
			const rgb = this.hexToRgb(hexColor);
			return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
		}
		return 0;
	}

	readJson(file: string, callback: (response: string) => void) {
		const req = new XMLHttpRequest();
		req.onerror = function () {
			// Utils.log(`[Utils][readJson] Error while trying to read  ${file}`, e);
		};
		req.overrideMimeType('application/json');
		req.open('GET', file, true);
		req.onreadystatechange = function () {
			if (req.readyState === 4) {
				// && req.status == "200") {
				if (callback) callback(req.responseText);
			}
		};
		req.send(null);
	}

	loadScript(url: string, callback: (url: string, loaded: boolean) => void) {
		const el = document.createElement('script');
		el.src = url;
		el.onload = function () {
			callback(url, true);
		};
		el.onerror = function () {
			console.error('Failed to load file: ' + url);
			callback(url, false);
		};
		document.body.appendChild(el);
	}

	parseJson(jsonString: string) {
		if (typeof jsonString === 'object') return jsonString;
		try {
			const o = JSON.parse(jsonString);

			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			// but... JSON.parse(null) returns null, and typeof null === "object",
			// so we must check for that, too. Thankfully, null is falsey, so this suffices:
			if (o && typeof o === 'object') {
				return o;
			}
		} catch (e) {
			return;
		}

		return false;
	}

	parseJSONPromise(jsonString: string) {
		// fetch('/my-json-doc-as-string')
		// .then(Utils.parseJSONPromise)
		// .then(heresYourValidJSON)
		// .catch(error - or return default JSON)

		return new Promise((resolve, reject) => {
			try {
				resolve(JSON.parse(jsonString));
			} catch (e) {
				reject(e);
			}
		});
	}

	/**
	 * @deprecated - use lodash.get
	 */
	getProperty<T>(
		obj: { [key: string]: T },
		dotSeparatedKeys: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		defaultValue: any
	) {
		if (arguments.length > 1 && typeof dotSeparatedKeys !== 'string')
			return undefined;
		if (typeof obj !== 'undefined' && typeof dotSeparatedKeys === 'string') {
			const pathArr = dotSeparatedKeys.split('.');
			pathArr.forEach((key, idx, arr) => {
				if (typeof key === 'string' && key.includes('[')) {
					try {
						// extract the array index as string
						const posMatch = /\[([^)]+)\]/.exec(key);
						if (!posMatch) throw new Error('Could not match regex');
						const pos = posMatch[1];
						// get the index string length (i.e. '21'.length === 2)
						const posLen = pos.length;
						arr.splice(idx + 1, 0, Number(pos).toString()); // is this redundant?

						// keep the key (array name) without the index comprehension:
						// (i.e. key without [] (string of length 2)
						// and the length of the index (posLen))
						arr[idx] = key.slice(0, -2 - posLen); // eslint-disable-line no-param-reassign
					} catch (e) {
						// do nothing
					}
				}
			});
			// eslint-disable-next-line no-param-reassign, no-confusing-arrow
			obj = pathArr.reduce(
				// I'm not sure what this is supposed to accomplish and it's
				// eventually going to get replaced with lodash anyway

				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				(o, key) => (o && o[key] !== 'undefined' ? o[key] : undefined),
				obj
			);
		}
		return obj === undefined ? defaultValue : obj;
	}

	getProp<T>(
		jsn: { [key: string]: T },
		str: string,
		defaultValue = {},
		sep = '.'
	) {
		const arr = str.split(sep);
		return arr.reduce(
			(obj, key) => (obj && key in obj ? obj[key] : defaultValue),
			jsn
		);
	}

	/**
	 * @deprecated - use lodash.set
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setProp(jsonObj: any, path: string, value: any) {
		const names = path.split('.');
		let jsn = jsonObj;

		// createNestedObject(jsn, names, values);
		// If a value is given, remove the last name and keep it for later:
		const targetProperty = arguments.length === 3 ? names.pop() : false;

		// Walk the hierarchy, creating new objects where needed.
		// If the lastName was removed, then the last object is not set yet:
		for (let i = 0; i < names.length; i++) {
			jsn = jsn[names[i]] = jsn[names[i]] || {};
		}

		// If a value was given, set it to the target property (the last one):
		if (targetProperty) jsn = jsn[targetProperty] = value;

		// Return the last object in the hierarchy:
		return jsn;
	}

	getDataUri(
		url: string,
		callback: (uri: string) => void,
		inCanvas: boolean,
		inFillcolor: string
	) {
		const image = new Image();

		image.onload = () => {
			const canvas =
				inCanvas && this.isCanvas(inCanvas)
					? inCanvas
					: document.createElement('canvas');

			canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
			canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size

			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error('Could not get 2d context');
			if (inFillcolor) {
				ctx.fillStyle = inFillcolor;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
			ctx.drawImage(image, 0, 0);
			// Get raw image data
			// callback && callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

			// ... or get as Data URI
			callback(canvas.toDataURL('image/png'));
		};

		image.src = url;
	}

	/** Quick utility to inject a style to the DOM
	 * e.g. injectStyle('.localbody { background-color: green;}')
	 */
	injectStyle(styles: string, styleId: string) {
		const node = document.createElement('style');
		const tempID = styleId || this.randomString(8);
		node.setAttribute('id', tempID);
		node.innerHTML = styles;
		document.body.appendChild(node);
		return node;
	}

	loadImage(
		inUrl: string | string[],
		callback: (uri: string) => void,
		inCanvas?: HTMLCanvasElement,
		inFillcolor?: string
	) {
		/** Convert to array, so we may load multiple images at once */
		const aUrl = !Array.isArray(inUrl) ? [inUrl] : inUrl;
		const canvas =
			inCanvas && inCanvas instanceof HTMLCanvasElement
				? inCanvas
				: document.createElement('canvas');
		let imgCount = aUrl.length - 1;
		const imgCache: { [key: string]: HTMLImageElement } = {};

		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Could not get 2d context');
		ctx.globalCompositeOperation = 'source-over';

		for (const url of aUrl) {
			const image = new Image();
			const cnt = imgCount;
			// const w = 144;
			// const h = 144;

			image.onload = function () {
				imgCache[url] = image;
				// look at the size of the first image
				if (url === aUrl[0]) {
					canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
					canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size
				}
				// if (Object.keys(imgCache).length == aUrl.length) {
				if (cnt < 1) {
					if (inFillcolor) {
						ctx.fillStyle = inFillcolor;
						ctx.fillRect(0, 0, canvas.width, canvas.height);
					}
					// draw in the proper sequence FIFO
					aUrl.forEach(e => {
						if (!imgCache[e]) {
							console.warn(imgCache[e], imgCache);
						}

						if (imgCache[e]) {
							ctx.drawImage(imgCache[e], 0, 0);
							ctx.save();
						}
					});

					callback(canvas.toDataURL('image/png'));
					// or to get raw image data
					// callback && callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
				}
			};

			imgCount--;
			image.src = url;
		}
	}

	getData(url: string) {
		// Return a new promise.
		return new Promise(function (resolve, reject) {
			// Do the usual XHR stuff
			const req = new XMLHttpRequest();
			// Make sure to call .open asynchronously
			req.open('GET', url, true);

			req.onload = function () {
				// This is called even on 404 etc
				// so check the status
				if (req.status === 200) {
					// Resolve the promise with the response text
					resolve(req.response);
				} else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error(req.statusText));
				}
			};

			// Handle network errors
			req.onerror = function () {
				reject(Error('Network Error'));
			};

			// Make the request
			req.send();
		});
	}

	// this apparently wasn't used anywhere
	// negArray<T>(arr: T[]) {
	// 	/** http://h3manth.com/new/blog/2013/negative-array-index-in-javascript/ */
	// 	return Proxy.create({
	// 		set: function (proxy, index, value) {
	// 			index = parseInt(index);
	// 			return index < 0
	// 				? (arr[arr.length + index] = value)
	// 				: (arr[index] = value);
	// 		},
	// 		get: function (proxy, index) {
	// 			index = parseInt(index);
	// 			return index < 0 ? arr[arr.length + index] : arr[index];
	// 		}
	// 	});
	// }

	// this also wasn't used anywhere
	// why are these even in the file
	// onChange(object, callback) {
	// 	/** https://github.com/sindresorhus/on-change */
	// 	const handler = {
	// 		get(target, property, receiver) {
	// 			try {
	// 				console.log('get via Proxy: ', property, target, receiver);
	// 				return new Proxy(target[property], handler);
	// 			} catch (err) {
	// 				console.log('get via Reflect: ', err, property, target, receiver);
	// 				return Reflect.get(target, property, receiver);
	// 			}
	// 		},
	// 		set(target, property, value, receiver) {
	// 			console.log('Utils.onChange:set1:', target, property, value, receiver);
	// 			// target[property] = value;
	// 			const b = Reflect.set(target, property, value);
	// 			console.log('Utils.onChange:set2:', target, property, value, receiver);
	// 			return b;
	// 		},
	// 		defineProperty(target, property, descriptor) {
	// 			console.log(
	// 				'Utils.onChange:defineProperty:',
	// 				target,
	// 				property,
	// 				descriptor
	// 			);
	// 			callback(target, property, descriptor);
	// 			return Reflect.defineProperty(target, property, descriptor);
	// 		},
	// 		deleteProperty(target, property) {
	// 			console.log('Utils.onChange:deleteProperty:', target, property);
	// 			callback(target, property);
	// 			return Reflect.deleteProperty(target, property);
	// 		}
	// 	};
	//
	// 	return new Proxy(object, handler);
	// }

	// unused
	// observeArray(object, callback) {
	// 	'use strict';
	// 	const array = [];
	// 	const handler = {
	// 		get(target, property, receiver) {
	// 			try {
	// 				return new Proxy(target[property], handler);
	// 			} catch (err) {
	// 				return Reflect.get(target, property, receiver);
	// 			}
	// 		},
	// 		set(target, property, value, receiver) {
	// 			console.log(
	// 				'XXXUtils.observeArray:set1:',
	// 				target,
	// 				property,
	// 				value,
	// 				array
	// 			);
	// 			target[property] = value;
	// 			console.log(
	// 				'XXXUtils.observeArray:set2:',
	// 				target,
	// 				property,
	// 				value,
	// 				array
	// 			);
	// 		},
	// 		defineProperty(target, property, descriptor) {
	// 			callback(target, property, descriptor);
	// 			return Reflect.defineProperty(target, property, descriptor);
	// 		},
	// 		deleteProperty(target, property) {
	// 			callback(target, property, descriptor);
	// 			return Reflect.deleteProperty(target, property);
	// 		}
	// 	};
	//
	// 	return new Proxy(object, handler);
	// }
}

export default new Utils();
