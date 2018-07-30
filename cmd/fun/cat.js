const { RichEmbed } = require('discord.js');
const { load } = require('cheerio');

exports.run = async(client, msg, args) => {
  const fetchMessage = await msg.channel.send('🔎Fetching...');
  try{
  const body = await client.req({url: 'http://random.cat'});
  
  const emb = new RichEmbed()
  .setColor(client.color) .setAuthor('Random Cat', 'https://purr.objects-us-west-1.dream.io/static/img/random.cat-logo.png')
  .setImage(load(body)('img#cat').attr('src'));
  fetchMessage.edit(emb);
  }catch(e){
  fetchMessage.edit('i can\'t fetched the cat try again later');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['🐈', '🐱'],
  permLevel: 0
};

exports.help = {
  name : "cat",
  description: "Show random cat",
  usage: "cat"
};