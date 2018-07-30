const feed = require('../feed.js');

class feeder {
  static async mcnet (client){
    const newFeed = await feed.mcnetfeed();
    if(!newFeed) return;
    const emb = newEmbed('image', newFeed.title, newFeed.description, newFeed.pubDate, newFeed.link, newFeed.image);
    newFeed.channel.forEach(x => !client.channels.get(x) ? undefined : client.channels.get(x).send(emb));
  }
  static async animefeed (client){
    const newFeed = await feed.animefeed();
    if(!newFeed) return;
    const emb = newEmbed('category', newFeed.title, newFeed.description, newFeed.pubDate, newFeed.link, newFeed.category.join(', '));
    newFeed.channel.forEach(x => !client.channels.get(x) ? undefined : client.channels.get(x).send(emb));
  }
}

const { RichEmbed } = require('discord.js');
function newEmbed(...args){
    let emb = new RichEmbed()
    .setColor('#0071FF')
    .setTitle(args[1])
    .setDescription(args[2])
    .setURL(args[4])
    .setFooter(`pubDate • ${args[3]}`);
  switch(args[0]){
    case 'category' :
      emb.addField('Category', args[5]);
      return emb;
      break;
    case 'image' :
      emb.setImage(args[5]);
      return emb;
      break;
  }
}

module.exports = async (client) => {
  await feeder.animefeed(client);
  await feeder.mcnet(client);
}  