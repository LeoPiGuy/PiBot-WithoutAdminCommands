const fs = require("fs");
const tele = "../telephone.json";
const telephone = require(tele);

module.exports.run = async (bot, message, args) => {
	if(!args[0]) return message.reply("You need to specify either \"start\" to initiate a game, \"join\" to join a game, or \"begin\" to begin the game.");
	if(args[0] == "start" || args[0] == "join" || args[0] == "begin") {
		switch(args[0]) {
			case "start":
				if(!args[1]) return message.reply("You need to specify a game key for the game. Ex: !telephone start pibot");
				let teleList = JSON.parse(fs.readFileSync("telephone.json", function(err, data) {
					if (err) throw err
				}));
				console.log(teleList);
				if(teleList) {
					for(let i in teleList) {
						let key = i;
						if(args[1] == key) return message.reply(`The key "${args[1]}" is currently in use. Please choose another.`);
						console.log(key);
					}
				}
				telephone[args[1]] = {
					"user": message.member.id,
					"users": {},
					"channels": [],
					"begun": false
				}
				telephone[args[1]]["users"][message.member.id] = {
						"name": message.member.displayName,
						"channel": message.channel.id
				}
				telephone[args[1]]["channels"].push(message.channel.id);
				fs.writeFile("telephone.json",JSON.stringify(telephone, null, 4), err => {
					if(err) throw err;
					console.log(`I have added the key ${args[1]} and the member ${message.member.displayName}|${message.member.id} as well as his channel ${message.channel.id} to telephone`);
					message.channel.send(`@everyone The queue for a game of telephone with the key "${args[1]}" has started.`);
				});
				break;
			case "join":
				if(!args[1]) return message.reply("You need to specify a game key for the game which you want to join. Ex: !telephone join pibot");
				let keyList = JSON.parse(fs.readFileSync("telephone.json", function(err, data) {
					if(err) throw err
				}));
				console.log(keyList);
				let key = null;
				if(keyList) {
					for(let i in keyList) {
						let k = i;
						if(args[1] == k) {
							key = args[1];
						};
					}
				}
				console.log(key);
				if(!key) return message.reply(`The key "${args[1]}" is not currently a game key.`)
				// if(!telephone[args[1]]["users"]) {
				// 	telephone[args[1]]["users"] = {}
				// 	telephone[args[1]]["users"][message.member.id] = {
				// 		"name": message.member.displayName
				// 	}
				// 	fs.writeFile("telephone.json",JSON.stringify(telephone, null, 4), err => {
				// 		if(err) throw err;
				// 		console.log(`I have added the member ${message.member.mention} to the game of telephone with the key "${args[1]}".`);
				// 		message.reply(`You have been added to the queue for the game of telephone with the key "${args[1]}".`);
				// 	});
				// } else 
				if(!telephone[args[1]]["users"][message.member.id]) {
					// for(let i in telephone[args[1]]["channels"]) {
					// 	if(i !== message.channel.id) {
					// 		telephone[args[1]]["channels"].push(message.channel.id);
					// 		console.log(`I have added the channel ${message.channel.id} to the game of telephone with the key ${key}`)
					// 	}
					// }
					if(!telephone[args[1]]["channels"].includes(message.channel.id)) {
						telephone[args[1]]["channels"].push(message.channel.id);
						console.log(`I have added the channel ${message.channel.id} to the game of telephone with the key ${key}`)
					}
					telephone[args[1]]["users"][message.member.id] = {
						"name": message.member.displayName,
						"channel": message.channel.id
					}
					fs.writeFile("telephone.json",JSON.stringify(telephone, null, 4), err => {
						if(err) throw err;
						console.log(`I have added the member ${message.member.displayName}|${message.member.id} to the game of telephone with the key "${args[1]}".`);
						message.reply(`You have been added to the queue for the game of telephone with the key "${args[1]}".`);
					});
				} else if(telephone[args[1]]["users"][message.member.id]) {
					message.reply(`You are already in the queue for the game of telephone with the key "${args[1]}".`)
				}
				console.log(telephone[args[1]]["users"][message.member.id])
				let userList = telephone[args[1]]["users"];
				console.log(userList);
				break;
			case "begin":
				if(!args[1]) return message.reply("You need to specify a game key for the game which you want to start. Ex: !telephone begin pibot");
				let kehList = JSON.parse(fs.readFileSync("telephone.json", function(err, data) {
					if(err) throw err
				}));
				console.log(kehList);
				let keh = null;
				if(kehList) {
					for(let i in kehList) {
						let k = i;
						if(args[1] == k) {
							keh = args[1];
						};
					}
				}
				console.log(keh);
				if(!keh) return message.reply(`The key "${args[1]}" is not currently a game key.`)
				let creator = telephone[args[1]]["user"];
				if(creator == message.member.id) {
					if(!telephone[args[1]]["begun"]) {
						//telephone[args[1]]["begun"] = true;
						fs.writeFile("telephone.json", JSON.stringify(telephone, null, 4), err => {
							if (err) throw err;
						})
						console.log("RUNNING COMMAND")
						let runTelephone = require("./telephone/runTelephone.js");
						runTelephone.run(keh, bot);
					} else {
						message.reply("The telephone game with the key " + keh + " has already begun!")
					}
				} else {
					return message.reply(`You are not the one who started the game of telephone with the key ${keh}. Only he can start the game.`);
				}
				break;
		}
	} else {
		return message.reply("Invalid arguments. You need to specify either \"start\" to initiate a game, \"join\" to join a game, or \"begin\" to begin the game.");
	}
}

module.exports.help = {
	name: "telephone",
	description: "Use to set up, join, and start a game of telephone. --- NOT FULLY FUNCTIONAL"
}