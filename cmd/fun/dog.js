const { RichEmbed } = require('discord.js');

exports.run = async(client, msg, args) => {
  const fetchMessage = await msg.channel.send('🔎Fetching...');
  try{
  const { body } = await client.snek.get('http://random.dog/woof.json');
  
  const emb = new RichEmbed()
  .setColor(client.color) .setAuthor('Random Dog', 'https://random.dog/favicon.ico')
  .setImage(body.url);
  fetchMessage.edit(emb);
  }catch(e){
  fetchMessage.edit(`i can't fetched the dog because \`${e.message}\`. try again later`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['🐕', '🐶'],
  permLevel: 0
};

exports.help = {
  name : "dog",
  description: "Show random dog",
  usage: "dog"
};