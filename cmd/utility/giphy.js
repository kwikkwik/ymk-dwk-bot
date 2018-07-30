const emb = require('discord.js').RichEmbed;

exports.run = async (client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No query provided', this.help);
	const searchMessage = await msg.channel.send('🔎Searching');
	msg.channel.startTyping();
	try{
		const { data } = await client.req({
			url: 'http://api.giphy.com/v1/gifs/search',
			qs: {
				q: encodeURIComponent(args.join(' ')),
				api_key: 'dc6zaTOxFJmzC',
				rating: msg.channel.nsfw ? 'r' : 'pg'
			},
      json: true
		});
		
    if(data.length < 1) {
      searchMessage.edit('❗**No result found**');
      msg.channel.stopTyping();
    }
		const embed = new emb()
		.setColor(client.color)
		.setImage(data[Math.floor(Math.random()*data.length)-1].images.original.url);
		searchMessage.edit(embed).then(()=> msg.channel.stopTyping());
	}catch(e){
		msg.channel.stopTyping();
	}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['gif'],
  permLevel: 0
};

exports.help = {
  name : "giphy",
  description: "Search image in ghipy with give query",
  usage: "giphy <query>"
};