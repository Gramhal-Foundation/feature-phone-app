export const getLocale = () => {
	const lang = navigator.language.split('-')[0].toLowerCase();
	return lang;
};
