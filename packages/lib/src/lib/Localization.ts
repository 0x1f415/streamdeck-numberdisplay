import Utils from './Utils';

export const loadLocalization = (
	lang: string,
	pathPrefix: string,
	cb: () => void
) => {
	Utils.readJson(`${pathPrefix}${lang}.json`, function () {
		// TODO implement this later

		// const manifest = Utils.parseJson(jsn);
		// const $localizedStrings =
		// 	manifest && 'Localization' in manifest ? manifest['Localization'] : {};
		if (cb && typeof cb === 'function') cb();
	});
};
