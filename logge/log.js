const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const characters = '🖤'; // Signature Karma Akabane
const getCurrentTime = () => colors.gray(moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"));

function logError(prefix, message, ...extra) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ❌ ${prefix}:`)}`, message);
	for (let err of extra) {
		if (typeof err === "object" && !err.stack) err = JSON.stringify(err, null, 2);
		console.log(`${getCurrentTime()} ${colors.redBright(`${characters} ❌ ${prefix}:`)}`, err);
	}
}

function logWarn(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "WARN";
	}
	console.log(`${getCurrentTime()} ${colors.yellowBright(`${characters} ⚠️ ${prefix}:`)}`, message);
}

function logInfo(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "INFO";
	}
	console.log(`${getCurrentTime()} ${colors.greenBright(`${characters} ℹ️ ${prefix}:`)}`, message);
}

function logSuccess(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "SUCCES";
	}
	console.log(`${getCurrentTime()} ${colors.cyanBright(`${characters} ✅ ${prefix}:`)}`, message);
}

function logMaster(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "MASTER";
	}
	console.log(`${getCurrentTime()} ${colors.hex("#eb6734", `${characters} 💥 ${prefix}:`)}`, message);
}

// Fonction dev avec position du code
function logDev(...args) {
	if (!["development", "production"].includes(process.env.NODE_ENV)) return;
	try { throw new Error(); } 
	catch (err) {
		const at = err.stack.split('\n')[2];
		let position = at.slice(at.indexOf(process.cwd()) + process.cwd().length + 1);
		if (position.endsWith(')')) position = position.slice(0, -1);
		console.log(`\x1b[36m${position} =>\x1b[0m`, ...args);
	}
}

module.exports = {
	err: logError,
	error: logError,
	warn: logWarn,
	info: logInfo,
	success: logSuccess,
	master: logMaster,
	dev: logDev
};
