module.exports.run = async (bot, message, args) => {
	let wikipediaArticle = "";
	console.log(args);
	if(args !== []) {
		if(args[0] < 261 && args[0] > 0) {
			wikipediaArticle = `https://en.wikipedia.org/wiki/${args[0]}_(number)#`
		} else {
			let randomNumber = Math.floor(Math.random()*260);
			wikipediaArticle = `https://en.wikipedia.org/wiki/${randomNumber}_(number)#`
		}
	}
	message.channel.send(wikipediaArticle);
}

module.exports.help = {
	name: "wikipedia",
	description: "Returns a random wikipedia number link."
}