var pi = require("pi");
var discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	let msg = await message.channel.send("Generating Pi...");

	if(!args[0]) return message.reply("You need to specify the number of digits of pi you want calculated.")
	if(isNaN(args[0])) return message.reply("Invalid number.");
	if(args[0] > 1951) return message.reply("Invalid number. Must be between 1 and 1951");
	let num = parseInt(args[0]);
	await message.channel.send(pi(num));
	msg.delete();
}

module.exports.help = {
	name: "pi",
	description: "Generates n digits of Pi."
}