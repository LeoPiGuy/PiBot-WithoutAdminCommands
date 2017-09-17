module.exports.run = async (bot, message, args) => {
	message.channel.send("Eat this yummy pi(e)!")
	message.channel.send({files: [
		{
			attachment: "https://cdn.nashvillescene.com/files/base/scomm/nvs/image/2017/03/960w/pi_day.58c2cf87a0dd8.jpg",
			name: "pie.png"
		}
	]})
}

module.exports.help = {
	name: "pie",
	description: "Eat that yummy pie."
}