const {RichEmbed} = require('discord.js');

exports.run = async (client, msg, args) => {
  let user;
  if (msg.mentions.users.size) { user = msg.mentions.users.first(); }
  else if (args[0]) { user = await msg.guild.fetchMember(args[0]);
  if (user) { user = user.user; } }
  if (!user) { user = msg.author; }
  
  const emb = new RichEmbed()
  .setColor(client.color)
  .setDescription(`👤 **| ${user.tag}**\n[Avatar Link](${user.avatarURL})`)
  .setImage(user.avatarURL);
  msg.channel.send(emb);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['av'],
  permLevel: 0
};

exports.help = {
  name : "avatar",
  description: "Display big avatar of user mention or you",
  usage: "avatar"
};