const cheerio = require('cheerio');
const request = require('request-promise-native');
const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No query provided', this.help);
	const searchMsg = await msg.channel.send('🔎 Searching....');
	
	let google = {
		url: 'http://google.com/search',
		qs: {
			q: encodeURIComponent(args.join(' ')),
			safe: 'active'
		}
	}
	
	let response = await request(google);
	let $ = cheerio.load(response);
	let results = [];
	
	$('.g').each((i) => { results[i] = {}; });
	$('.g>.r>a').each((i,e) => {
		let raw = e.attribs['href'];
		results[i]['teksLink'] = `[${decodeURIComponent(getText(e))}](${raw.substr(7, raw.indexOf('&sa=U') - 7)})`;
	});
	$('.g>.s>.st').each((i,e) => {
		results[i]['description'] = decodeURIComponent(getText(e));
	});
		
	results = results.filter(r => r.teksLink && r.description).slice(0, 3);
	if(!results.join(' ')) return searchMsg.edit('No results found');
	const emb = new RichEmbed()
	.setColor(client.color)
	.setDescription(results.map(x => `${x.teksLink}\n${x.description}` ).join('\n'))
	.setFooter('Powered by Google', 'http://i.imgur.com/b7k7puJ.jpg');
	searchMsg.edit(emb);
};

function getText(children) {
  if (children.children) return getText(children.children);
  return children.map(c => {
    return c.children ? getText(c.children) : c.data;
  }).join('');
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['gl', 'search'],
  permLevel: 0
};

exports.help = {
  name : "google",
  description: "Returns searching the google",
  usage: "google <query>"
};