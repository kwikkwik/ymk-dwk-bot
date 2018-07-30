const { RichEmbed } = require('discord.js');
const translate = require('@k3rn31p4nic/google-translate-api');

exports.run = async(client, msg, args) => {
  if(args.length < 2) return args.missing(msg, 'Missing parameter', this.help);
  let result = await translate(args.slice(1).join(' '), { to: args[0] });
  const emb = new RichEmbed()
  .setColor(client.color)
  .setAuthor(`Translation from ${result.from.language.iso.toUpperCase()} to ${args[0].toUpperCase()}`, 'https://lh4.googleusercontent.com/proxy/rdZ081IpWDOEwVIyTPTKDHHzxb4BKgaqiFi-oeArFJYmP74tfp8_GC_m7WIMiGAboIvh5FITRYhMe0pdjG9GEf_FYCmBJ_3i_j8mTaQYPNl81QhdSEuo_sG2lb9cTKO1zdu9Tqz066z9vGC5BKp5pjJJ4W-w-alVnI16Ibz7afbRnWjaK7xL2Cb8TC0CH-D9=w384-h384-nc')
  .addField('📥INPUT', args.slice(1).join(' '))
  .addField('📤OUTPUT', result.text);
  msg.channel.send(emb);
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['trans', 'tl'],
  permLevel: 0
};

exports.help = {
  name : "translate",
  description: "Let's Translate something",
  usage: "translate <to> <text>"
};