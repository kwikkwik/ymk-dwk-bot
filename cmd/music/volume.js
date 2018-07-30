const { guildQueue } = require('../../util/music/opusytdl.js');

exports.run = (client, msg, args = []) => {
	const serverQueue = guildQueue(msg.guild.id);
  if(!serverQueue) return msg.channel.send('💤 Nothing play anything right now');
	if (!msg.member.voiceChannel) return msg.channel.send('❌You are not in a voice channel!');
		if (!args[0]) return msg.channel.send(`🔈The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['vl', 'vol'],
  permLevel: 0
};

exports.help = {
  name: "volume",
  description: "change the volume in the current song",
  usage: "volume <amount>"
}