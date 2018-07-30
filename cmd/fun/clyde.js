exports.run = async (client, msg, args) => {
  if(!args.join(' ')) return args.missing(msg, 'No text added', this.help);
  msg.channel.startTyping();
  const searchMessage = await msg.channel.send('🖌️Painting...');
  const { body } = await client.snek.get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${encodeURIComponent(args.join(' '))}`);
  msg.channel.send({file: { attachment:body.message, name: 'clyde.png'}}).then(()=> { searchMessage.delete(); msg.channel.stopTyping(); });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['cly'],
  permLevel: 0
};

exports.help = {
  name : "clyde",
  description: "Make clyde say something",
  usage: "clyde <text>"
};