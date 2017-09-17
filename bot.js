const botSet = "./botsettings.json";
const botSettings = require(botSet);
const Discord = require("discord.js");
const async = require("async");
const prefix = botSettings.prefix;
const fs = require("fs");
const readline = require('readline');

const timeInitialized = Date.now();
botSettings.tsi = timeInitialized;

fs.writeFile(botSet, JSON.stringify(botSettings, null, 4), function(err) {
	if (err) return console.log(err);
	console.log('Writing to: ' + botSet +":");
	console.log(JSON.stringify(botSettings));
});

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.readdir("./cmds/", (err, files) => {
	if(err) console.error(err);

	let jsFiles = files.filter(f => f.split(".").pop() === "js");
	if(jsFiles.length <= 0) {
		console.log("No commands to load");
		return;
	}

	console.log(`Loading ${jsFiles.length} commands!`)
	jsFiles.forEach((f,i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});

console.log("Token: " + botSettings.token);
console.log("Prefix: " + botSettings.prefix);

bot.on("ready", async () => {
	console.log(`Bot is ready! | Username: ${bot.user.username}`);
	//console.log(bot.commands);
	try {
		//let link = await bot.generateInvite(['ADD_REACTIONS', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'CHANGE_NICKNAME']);
		let link = await bot.generateInvite(['ADMINISTRATOR']);
		console.log(link);
	} catch(e) {
		console.log(e.stack);
	}

	bot.setInterval(() => {
		for(let i in bot.mutes) {
			let time = bot.mutes[i].time;
			let guildId = bot.mutes[i].guild;
			let guild = bot.guilds.get(guildId);
			let member = guild.members.get(i);
			let mutedRole = guild.roles.find(r => r.name === "PiBot Muted");
			if(!mutedRole) continue;

			if(Date.now() > time) {
				console.log(`${i} is now able to be unmuted`);

				member.removeRole(mutedRole);
				delete bot.mutes[i];

				fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
					if(err) throw err;
					console.log(`I have unmuted ${member.user.tag}.`);
				})
			}
		}
	}, 5000);
});

rl.on("line", async (line) => {
	if(line.startsWith(">")){
		let chatList =line.split(" ");
		let id = chatList[0].slice(1);
		let message = chatList.slice;
		if(chatList[1]) message = chatList.slice(2).join(" ");
		//if(!chatList[1]) message = chatList.slice(1).join(" ");
		console.log(message);
		let channels = bot.channels;
		let prefix = "";
		if(chatList[1].startsWith("@")){
			mid = chatList[1].slice(1);
			prefix = "<@" + mid + "> ";
		};
		bot.channels.get(id).send(prefix + message);
	} else if(line == "end") {
		bot.channels.forEach(function (channel){
			//console.log(channel.id);
			if(channel.id == 337428430276788227) {
				//console.log(channel.name + 2);
				channel.send("Shutting Down").then(console.log(channel.id)).catch(console.log(channel.id));
			// 	let channelSend = bot.channels.get(channel.id).send("Shutting Down...").then(message => console.log(`Sent message: ${message.content}`)).catch(console.log(this.error));
			} else if(channel.id == 316404924269330432){
			// 	console.log(channel);
				channel.send("Shutting Down").then(console.log(channel.id)).catch(function (err) {if(err){console.log(channel.id)}});
			}
		process.exit();
		});
	}
 });

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	let role1 = message.guild.roles.find(r => r.name === "PiBotUser");
	let role2 = message.guild.roles.find(r => r.name === "Secret Role");
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if(!command.startsWith(prefix)) return;
	if(!role1 || !role2) {
		let cmd = bot.commands.get(command.slice(prefix.length));
		if(cmd) cmd.run(bot, message, args);
	} else { 
		if(!message.guild.member(message.author).roles.has(role1.id) && !message.guild.member(message.author).roles.has(role2.id)) return message.channel.send("You dont have permission to use this command. Contact an administrator if you feel this is wrong.");
		let cmd = bot.commands.get(command.slice(prefix.length));
		if(cmd) cmd.run(bot, message, args);
	}
	// if(command === `${prefix}userinfo`) {
	// 	let embed = new Discord.RichEmbed()
	// 		.setAuthor(message.author.username)
	// 		.setDescription("This is the user's info!")
	// 		.setColor("9B59B6")
	// 		.addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
	// 		.addField("ID", `${message.author.id}`)
	// 		.addField("Created At", `${message.author.createdAt}`);

	// 	message.channel.send({embed: embed});

	// 	return;
	// }

	// if(command === `${prefix}mute`) {
	// 	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have manage messages.");

 // 		let toMute = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
	// 	if(!toMute) return message.channel.send("You did not specify a user mention or ID!");

	// 	if(toMute.id === message.author.id) return message.channel.send("You cannot mute yourself.");
	// 	if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot mute a member who is higher or has the same role as you.")


	// 	let role = message.guild.roles.find(r => r.name === "PiBot Muted");
	// 	if(!role) {
	// 		try{
	// 			role = await message.guild.createRole({
	// 				name: "PiBot Muted",
	// 				color: "000000",
	// 				permissions: []
	// 			});

	// 			message.guild.channels.forEach(async (channel, id) => {
	// 				await channel.overwritePermissions(role, {
	// 					SEND_MESSAGES: false,
	// 					ADD_REACTIONS: false
	// 				});
	// 			});
	// 		} catch(e) {
	// 			console.log(e.stack);
	// 		}
	// 	}
		
	// 	if(toMute.roles.has(role.id)) return message.channel.send("This user is already muted!");

	// 	await toMute.addRole(role);
	// 	message.channel.send("I have muted them.");

	// 	return;

	// }

	// if(command === `${prefix}unmute`) {
	// 	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have manage messages.");

 // 		let toMute = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
	// 	if(!toMute) return message.channel.send("You did not specify a user mention or ID!");

	// 	if(toMute.id === message.author.id) return message.channel.send("You cannot unmute yourself.");
	// 	if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot unmute a member who is higher or has the same role as you.")

	// 	let role = message.guild.roles.find(r => r.name === "PiBot Muted");

		
	// 	if(!role || !toMute.roles.has(role.id)) return message.channel.send("This user is not muted!");

	// 	await toMute.removeRole(role);
	// 	message.channel.send("I have unmuted them.");

	// 	return;

	// }
});

bot.login(botSettings.token);