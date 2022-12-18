const logTypes = {
	info:  ['INFO', 36],
	warn:  ['WARN', 33],
	err:   ['ERR', 31],
	debug: ['DEBUG', 37]
};

maxTypeLength = 0;
Object.keys(logTypes).forEach(key => {
	if(maxTypeLength < logTypes[key][0].length) {
		maxTypeLength = logTypes[key][0].length;
	}
});

debugMode = false;

module.exports = {
	setDebug: mode => debugMode = mode,
	print: (type, message) => {
		if(type != 'debug' || (type == 'debug' && debugMode)) {
			console.log(
				'\x1b[' + logTypes[type][1] + 'm' +
				'[' + logTypes[type][0] + ']' +
				' '.repeat(maxTypeLength - logTypes[type][0].length + 1) +
				message + '\x1b[0m');
		}
	}
}
