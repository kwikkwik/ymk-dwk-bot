const { RichEmbed } = require('discord.js');
const number = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

exports.run = async (client, msg, args) => {
	const fetchMessage = await msg.channel.send('🔎Fetching...');
	try{
		const data = await scrape(client);
		const emb = new RichEmbed()
		.setColor(client.color)
		.setDescription(data.map((x,d)=> `${number[d]} - [${x.title}](${x.link})`))
		.setFooter('Powered by feedback.minecraft.net', 'https://theme.zdassets.com/theme_assets/2155033/8ea3012f8759412bafaffd7d07248ed1e75d8afa.ico');
		fetchMessage.edit(emb);
	}catch(e){
		fetchMessage.edit(`Oh no an error occured \`${e}\``);
	}
};

const { load } = require('cheerio');
async function scrape(client){
	try{
		const body = await client.req({url: 'https://feedback.minecraft.net/hc/en-us/sections/360001185332-Beta-Information-and-Changelogs'});
		let arr = [];
		let $ = load(body);
		let base = $('.article-list').find('li').children()
		for(let i = 0; i < base.length; i++){
			arr.push({ title: base[i].children[0].data, link: `https://feedback.minecraft.net${base[i].attribs.href}`})
		}
		return arr.splice(0, 10);
	}catch(e){
		return e;
	}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['mcbi', 'mcchangelogs', 'mcbeta'],
  permLevel: 0
};

exports.help = {
  name : "mcbetainfo",
  description: "Look some info or changlogs form feedback.minecraft.net",
  usage: "mcbetainfo"
};