const fs = require("fs");
const botSettings = require("../botsettings.json");
const prefix = botSettings.prefix;
const Discord = require("discord.js");
const bot = require("./../bot.js");

module.exports.run = async (bot, message, args) => {
	fs.readdir("./cmds", (err, files) => {
		if(err) console.error(err);
		let commands = files.filter(f => f.split(".").pop() === "js");
		if(commands.length <= 0) {
			message.channel.send("There are no commands.");
			return;
		}

		message.author.send(`There are ${commands.length} commands!`);
		let list = new Discord.RichEmbed();
		commands.forEach((f,i) => {
			//console.log(f);
			let command = require(`./${f}`);
			let name = command.help.name;
			let description = command.help.description;
			let d = true;
			if(!name) return;
			if(!description) d = false;
			if(d === true) {
				list.addField(`${prefix}${name}`, `${description}`);
			} else if(d === false) {
				list.addField(`${prefix}${name}`, "There is no description.");
			}
		});
		message.author.send({embed: list});
		message.reply("I have sent you a DM with the chat commands.");
	});
}

module.exports.help = {
	name: "help",
	description: "Lists all possible commands."
}