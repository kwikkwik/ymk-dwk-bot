const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
  const fetchMessage = await msg.channel.send('🔎 Fetching...');
  const body = await client.req({url:'https://api-to.get-a.life/meme', json: true});
  const emb = new RichEmbed()
  .setColor(client.color)
  .setImage(body.url)
  .setFooter(body.text);
  fetchMessage.edit(' ', { embed:emb });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['mim'],
  permLevel: 0
};

exports.help = {
  name : "meme",
  description: "Get a random meme",
  usage: "meme"
};