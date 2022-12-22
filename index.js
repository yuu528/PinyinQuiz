const fs = require('fs');
const readlineSync = require('readline-sync');
const pinyin = require('node-pinyin');
const locale = require('./util/locale.js');
const logger = require('./util/logger.js');

const language = 'ja';

const toneSymbols = {
	a: ['ā', 'á', 'ǎ', 'à'],
	e: ['ē', 'é', 'ě', 'è'],
	o: ['ō', 'ó', 'ǒ', 'ò'],
	i: ['ī', 'í', 'ǐ', 'ì'],
	u: ['ū', 'ú', 'ǔ', 'ù'],
	v: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü']
};

process.stdin.setEncoding('utf8');

locale.setDefaultLocale(language);

// check args
if(process.argv.length < 2) {
	printUsage();
	process.exit();
}

if(!fs.existsSync(process.argv[2])) {
	printUsage();
	process.exit();
}

let fileText = fs.readFileSync(process.argv[2], 'utf8');
var questions = [];
fileText.split(/\r\n|\n/).forEach(line => {
	line = line.replace(' ', '');
	if(line.length > 0) {
		// ignore comment
		line.replace(/#.+/).trim();
		let lineData = line.split(':');
		if(lineData.length < 2) {
			lineData[1] = pinyin(lineData[0]).map(arr => arr.join('')).join('');
		}
		questions.push(lineData);
	}
});

// mode selection
let input = readlineSync.question(locale.get('prompt_mode_selection'));
corrects = 0;
questionCount = 0;
switch(input) {
	case '1': // han to pinyin quiz
		console.log(locale.get('msg_howto_input_pinyin'));
		console.log(locale.get('msg_pinyin_tone'));
		while(true) {
			if(hanToPinyinQuiz()) {
				corrects++;
			}
			questionCount++;
			console.log(locale.get('msg_number_of_correct') +
				corrects + '/' + questionCount + '(' + corrects / questionCount * 100 + ')');
		}
		break;

	case '2': // pinyin to han quiz
		while(true) {
			if(pinyinToHanQuiz()) {
				corrects++;
			}
			questionCount++;
			console.log(locale.get('msg_number_of_correct') +
				corrects + '/' + questionCount + '(' + corrects / questionCount * 100 + ')');
		}
		break;

	case '3': // mix above
		while(true) {
			if(Math.round(Math.random())) {
				if(hanToPinyinQuiz()) {
					corrects++;
				}
			} else {
				if(pinyinToHanQuiz()) {
					corrects++;
				}
			}
			questionCount++;
			console.log(locale.get('msg_number_of_correct') +
				corrects + '/' + questionCount + '(' + corrects / questionCount * 100 + ')');
		}
		break;

	case '4': // print questions
		logger.print('info', locale.get('msg_questions'));
		console.log(questions.map(question => question.join('(') + ')').join(', '));
		break;

	default:
		logger.print('err', locale.get('msg_wrong_selection'));
		break;
}

function printUsage() {
	logger.print('info', locale.get('msg_usage'));
}

function replaceCharPos(str, chara, pos) {
	return str.slice(0, pos) + chara + str.slice(pos + 1);
}

function hanToPinyinQuiz() {
	let index = Math.floor(Math.random() * questions.length);
	console.log('Q: ' + questions[index][0]);
	let rawAnswer = readlineSync.question(locale.get('prompt_pinyin'));
	// convert input to pinyin
	var invalid = false;
	var output = '';
	var tones = rawAnswer.replace(/[^0-4]/g, '').split('');
	rawAnswer.split(/[0-4]/).forEach((noTonePinyin, n) => {
		if(!invalid && noTonePinyin != '') {
		console.log(noTonePinyin + ' ' + tones[n]);
			var tmpIndex, tmpIndex2;
			if(tones[n] == 0) {
				output += noTonePinyin;
				finished = true;
			} else {
				var finished = false;
				['a', 'e', 'o'].forEach(c => {
					if(!finished && (tmpIndex = noTonePinyin.indexOf(c)) != -1) {
						output += replaceCharPos(noTonePinyin,
							toneSymbols[c][tones[n] - 1], tmpIndex);
						finished = true;
					}
				});
				if(!finished && (tmpIndex = noTonePinyin.indexOf('u')) != -1 &&
					(tmpIndex2 = noTonePinyin.indexOf('i')) != -1) {
					if(tmpIndex > tmpIndex2) {
						output += replaceCharPos(noTonePinyin,
							toneSymbols[noTonePinyin.charAt(tmpIndex)][tones[n] - 1], tmpIndex);
					} else {
						output += replaceCharPos(noTonePinyin,
							toneSymbols[noTonePinyin.charAt(tmpIndex2)][tones[n] - 1], tmpIndex2);
					}
					finished = true;
				} else {
					['u', 'i', 'v'].forEach(c => {
						if(!finished && (tmpIndex = noTonePinyin.indexOf(c)) != -1) {
							output += replaceCharPos(noTonePinyin,
								toneSymbols[c][tones[n] - 1], tmpIndex);
							finished = true;
						}
					});
				}
			}
			if(!finished) {
				console.log(locale.get('msg_invalid_pinyin'));
				invalid = true;
			}
		}
	});

	if(!invalid) {
		console.log(locale.get('msg_your_answer') + output);
	}

	if(output == questions[index][1]) {
		console.log(locale.get('msg_correct'));
		return true;
	} else {
		console.log(locale.get('msg_wrong') + ' ' +
			locale.get('msg_answer') + questions[index][1]);
		return false;
	}
}

function pinyinToHanQuiz() {
	let index = Math.floor(Math.random() * questions.length);
	console.log('Q: ' + questions[index][1]);
	let input = readlineSync.question(locale.get('prompt_han'));
	if(input == questions[index][0] ||
		pinyin(input).map(arr => arr.join('')).join('') == questions[index][1]) {
		console.log(locale.get('msg_correct'));
		return true;
	} else {
		console.log(locale.get('msg_wrong') + ' ' +
			locale.get('msg_answer') + questions[index][0]);
		return false;
	}
}
