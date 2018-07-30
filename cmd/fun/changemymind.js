exports.run = async (client, msg, args) => {
  if(args.length < 1) return args.missing(msg, 'No text added', this.help);
  msg.channel.startTyping();
  const searchMessage = await msg.channel.send('🖌️Painting...');
  const { body } = await client.snek.get(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${encodeURIComponent(args.join(' '))}`);
  msg.channel.send({file: { attachment:body.message, name: 'changemymind.png'}}).then(()=> { searchMessage.delete(); msg.channel.stopTyping(); });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['cmm', 'chamymind'],
  permLevel: 0
};

exports.help = {
  name : "changemymind",
  description: "Change your mind >:v",
  usage: "changemymind <text>"
};