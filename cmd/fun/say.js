exports.run = (client, msg, args) => {
  args = args.length < 1 ? 'I tried to send an empty message, yeah': args.join(' ');
  msg.channel.send(args).then(()=> msg.guild.me.hasPermission('MANAGE_MESSAGES') ? msg.delete() : undefined);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['echo'],
  permLevel: 0
};

exports.help = {
  name: "say",
  description: "Let bot say your text",
  usage: "say <text>"
};