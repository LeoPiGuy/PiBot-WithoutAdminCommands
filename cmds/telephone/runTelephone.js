const fs = require("fs");
const tele = "./../../telephone.json";
const telephone = require(tele);
const arrayShuffle = require("array-shuffle");
const english = require("common-english-words")

module.exports.run = async (key, bot) => {
	console.log("Atempting to start the game of telephone with the key " + key);

	let game = telephone[key];
	let players = game.users;
	let orderedPlayers = [];

	for(let i in players) {
		orderedPlayers.push(i);
	}
	orderedPlayers = arrayShuffle(orderedPlayers);
    console.log("orderedPlayers:" + orderedPlayers)
	for(let i in game.channels) {
		let channel = bot.channels.get(game.channels[i]);
		let playerList = "1| " + players[orderedPlayers[0]]["name"];
		for (k = 1; k < orderedPlayers.length; k++) {
			let obj = players[orderedPlayers[k]];
			let name = obj["name"];
			playerList += `\n${k + 1}| ${name}`;
			console.log(name);
		}
		channel.send({embed: {
		"title": `The game of telephone with the key ${key} has started! \n There are ${orderedPlayers.length} players participating in the game. \n Here they are in order:`,
		"description": playerList
		}})
	}
	//let wordlist = require("./../../wordlist.json")
	let wordlist = []
	let firstWord = []
	english.getWords(function(err, words) {
			wordlist = words;
	})
	firstWord = wordlist[Math.floor(Math.random() * wordlist.length)];
	console.log(firstWord)
	console.log(firstWord);
    console.log(players);
	console.log(orderedPlayers);
}