const db = require('../../util/database.js');


exports.run = (client, msg, args) => {
  if(!args[0]){
    return msg.channel.send('**The current prefix in this guild is** `' + db.setguild.getProp(msg.guild.id, 'prefix') + '`');
  }else{
    if(!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send('❌**You don\'t have permission MANAGE_GUILD**');
    const old = db.setguild.getProp(msg.guild.id, 'prefix');
    db.setguild.setProp(msg.guild.id, 'prefix', args[0]);
    msg.channel.send('✅**Prefix changed** ' + '`' + old + '`' + 'to `' + args[0] + '`');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name : "prefix",
  description: "set prefix",
  usage: "prefix <prefix>"
};