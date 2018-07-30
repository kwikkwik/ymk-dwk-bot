const Embed = require('discord.js').RichEmbed;

exports.run = async(client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No query provided', this.help);
	const { body } = await client.snek.get('https://store.steampowered.com/api/storesearch')
	.query({
		cc: 'us',
		l: 'en',
		term: encodeURIComponent(args.join('+'))
	});
	if(!body.items.length) return msg.channel.send('Could not find any results.');
	const { id, tiny_image} = body.items[0];
	const data = await getData(client, id);
	const curr = data.price_overview ? `$${data.price_overview.final / 100}` : 'Free';
	const ori = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Free';
	const price = curr === ori ? curr : `~~${ori}~~ ${curr}`;
	const platforms = [];
	if(data.platforms){
		if (data.platforms.windows) platforms.push('`Windows`');
		if (data.platforms.mac) platforms.push('`Mac`');
		if (data.platforms.linux) platforms.push('`Linux`');
	}
	const emb = new Embed()
	.setColor(client.color)
	.setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
	.setTitle(data.name)
	.setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
	.setThumbnail(tiny_image)
	.addField('💰 Price', price, true)
	.addField('✴️ Metascore', data.metacritic ? data.metacritic.score : '?', true)
	.addField('❓ Recommendations', data.recommendations ? data.recommendations.total : '?', true)
	.addField('💻 Platforms', platforms.join(', ') || 'None', true)
	.addField('📅 Release Date', data.release_date ? data.release_date.date : '?', true)
	.addField('🔗 DLC Count', data.dlc ? data.dlc.length : 0, true)
	.addField('👥 Developers', data.developers.join(', ') || '?')
	.addField('📢 Publishers', data.publishers.join(', ') || '?');
	msg.channel.send(emb);
};

async function getData(client, id){
  try{
	const { body } = await client.req({
		url: 'https://store.steampowered.com/api/appdetails',
		qs: {
			appids: id
		},
    json: true
	});
	return body[id.toString()].data
  }catch(e){
    return e;
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name : "steam",
  description: "Search game in steam",
  usage: "steam <query>"
};