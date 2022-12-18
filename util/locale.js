const fs = require('fs');
const logger = require('./logger.js');

defaultLocale = 'none';
localeDir = './locale/';
localeList = [];
localeData = {};

// get locale list
var localeFiles;
try {
	localeFiles = fs.readdirSync(localeDir);
} catch(err) {
	console.log(err);
	process.exit();
}
localeFiles.forEach(localeFile => {
	try {
		JSON.parse(fs.readFileSync(localeDir + localeFile, 'utf8'));
	} catch(err) {
		logger.print('warn', 'Invalid locale file: ' + localeFile);
	}

	localeList.push(localeFile.replace('.json', ''));
});

module.exports = {
	setDefaultLocale: locale => {
		if(locale == 'none' || localeList.find(l => l == locale)) {
			defaultLocale = locale;
			try {
				localeData = JSON.parse(fs.readFileSync(localeDir + locale + '.json', 'utf8'));
			} catch(err) {
				logger.print('err', 'Failed to load the locale file');
			}
		} else {
			logger.print('err', 'Unknown locale: ' + locale);
		}
	},
	get: name => {
		if(defaultLocale == 'none') {
			return name;
		} else if(localeData[name] != undefined) {
			return localeData[name];
		} else {
			logger.print('warn', 'No entry "' + name + '" in ' + defaultLocale + '.json');
			return name;
		}
	}
};
