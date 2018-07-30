const { RichEmbed } = require('discord.js');

exports.run = (client, msg, args) => {
   let you = [];
   const moneys = client.db.userprof.array().sort((a, b) => b.money - a.money);
   moneys.map(x => you.push(x.tag));
   const top10 = moneys.splice(0, 10);
   let index = 0;
   const emb = new RichEmbed()
   .setColor(client.color)
   .setTitle('💲 | The top 10 rich people')
   .setFooter(`You placing position ${you.indexOf(msg.author.id)+1}`, msg.author.avatarURL)
   .setDescription(top10.map(x => `\`${++index}\` - ${client.users.find('id', x.tag).tag} | 💵${x.money}`));
   
   
   msg.channel.send(emb);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['topbal', 'tpb'],
  permLevel: 0
};

exports.help = {
  name : "topbalance",
  description: "Let's look the rich people 👀",
  usage: "topbalance"
};