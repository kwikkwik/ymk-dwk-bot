const Discord = require('discord.js');

exports.run = (client, msg, args = []) => {
  if(args.length < 1) return args.missing(msg, 'No text added', this.help);
  const embed = new Discord.RichEmbed()
  .setColor('#0071FF')
  .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(args.join(' '))}`);
  msg.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['qr', 'gqr', 'generatorqr'],
  permLevel: 0
};

exports.help = {
  name: "qrcode",
  description: "Make qr code with given text",
  usage: "qrcode <text>"
};