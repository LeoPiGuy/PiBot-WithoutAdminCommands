const botSettings = require("./../botSettings");

module.exports.run = async (bot, message, args) => {
	let ti = botSettings.tsi;
	let tsi = Date.now() - ti;
	let timeSinceInitialized = tsi/1000;
	
	message.channel.send(`Time Since Initialized: ${timeSinceInitialized} seconds!`);
}

module.exports.help = {
	name: "tsi",
	description: "Returns time since initialized."
}