exports.run = (client, msg, args) => {
  let channel = 'This guild doesn\'t set anime feed channel';
  let thisFeed = false;
  if(client.db.setguild.getProp(msg.guild.id, 'animefeed').value === true){
    thisFeed = true;
    channel = `the anime feed can be look in <#${client.db.setguild.getProp(msg.guild.id, 'animefeed').channel}>`;
  }
  const didah = client.db.setguild.getProp(msg.guild.id, 'animefeed').channel;
  const emb = require('discord.js').RichEmbed;
  const embed = new emb()
  .setColor(client.color)
  .setTitle('📜 Anime Feed')
  .setDescription(channel)
  .addField('✅ Add Animefeed to this guild', `\`${msg.prefix}animefeed add <mention channel>\``)
  .addField('⛔ Delete Animefeed for this channel', `\`${msg.prefix}animefeed delete\``);
  if(!args[0])return msg.channel.send(embed);
    if(!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send('❌**You don\'t have permission MANAGE_GUILD**');
    if(args[0] === 'add') return addChannel(client,msg,thisFeed,embed,didah);
    if(args[0] === 'delete') return delChannel(client,msg,thisFeed,didah);
};

function addChannel(client, msg, confir, embed, didah){
  let juge = msg.mentions.channels.first();
  if(!juge) return msg.channel.send(embed);
  const num = client.db.feed;
  let newChannel = num.getProp('anime', 'channel');
  newChannel.push(juge.id);
  if(confir !== true){
  num.setProp('anime', 'channel', newChannel);
  }else{
    return msg.channel.send('I\'m sorry but you must delete first');
  }
    client.db.setguild.setProp(msg.guild.id, 'animefeed', {value: true, channel: juge.id});
  msg.channel.send('Im starting watching on <#' + juge.id + '>');
}

function delChannel(client, msg, confir, didah){
  if(confir === false) return msg.channel.send('This guild doesn\'t set animefeed so i can \'t delete this');
  client.db.setguild.setProp(msg.guild.id, 'animefeed', {value: false, channel: 0});
  let arr = client.db.feed.getProp('anime', 'channel');
  const index = arr.indexOf(didah);
  arr.splice(index, 1);
  client.db.feed.setProp('anime', 'channel', arr);
  msg.channel.send('Succes delete animefeed for this channel');
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name : "animefeed",
  description: "give lastest anime news form www.animenewsnetwork.com",
  usage: "animefeed"
};