const leoQuotes = require("./../leoquotes");

module.exports.run = async (bot, message, args) => {
	let quotes = leoQuotes.quotes;	
	let length = quotes.length;
	if(args == "list") {
		let quoteList = "1| '" + quotes[0];
		for(n = 1; n < quotes.length; n++) {
			let quote = quotes[n];
			quoteList += `\n${n+1}| "${quote}"`;
		}
		message.channel.send({embed: {
			"title": `There are ${length} LeoQuotes. Here they are:`,
			"description": quoteList
		}});
	} else {
		let quote = quotes[Math.floor(Math.random()*length)];
		message.channel.send("As said by Leo: '" + quote + "'");
	}
}

module.exports.help = {
	name: "leoquote",
	description: "Returns a random leoquote."
}