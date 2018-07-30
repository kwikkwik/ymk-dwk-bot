exports.run = async(client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No query provided', this.help);
	const { body } = await client.snek.get('http://api.urbandictionary.com/v0/define')
	.query({
		term: decodeURIComponent(args.join('+'))
	});
	if(body.result_type === 'no_results') return msg.channel.send(`There aren't any definitions for ${args.join(' ')}`);
	const list = body.list;
	
	msg.channel.send(getEmbed(client,list,0));
};

const Embed = require('discord.js').RichEmbed;
function getEmbed(client, list, index){
	return new Embed()
	.setColor(client.color)
	.setURL(list[index].permalink)
	.setThumbnail('https://cdn1.iconfinder.com/data/icons/school-icons-2/512/open_book_pen_marker-256.png')
	.setAuthor(`${list[index].word} definition by ${list[index].author}`, 'https://cdn.discordapp.com/attachments/225694598465454082/248910958280441868/photo.png')
	.addField('📖 Definition', `**${!list[index].definition ? 'No definition provided.' : (list[index].definition.length > 1024 ? `Definition is too big, click [here](${list[index].permalink})` : list[index].definition)}**`)
	.addField('\u2139 Example', `**${!list[index].example ? 'No example provided.' : (list[index].example.length > 1024 ? `example is too big, click [here](${list[index].permalink})` : list[index].example)}**`)
	.addField('👍', list[index].thumbs_up, true)
	.addField('👎', list[index].thumbs_down, true);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ub'],
  permLevel: 0
};

exports.help = {
  name : "urban",
  description: "Grabs definitions from www.urbandictionary.com.",
  usage: "urban <query>"
};