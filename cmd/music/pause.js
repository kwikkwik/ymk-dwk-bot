const { guildQueue } = require('../../util/music/opusytdl.js');

exports.run = (client, msg, args = []) => {
	const serverQueue = guildQueue(msg.guild.id);
	if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('✅ Paused the music for you!');
		}
		return msg.channel.send('💤 There is nothing playing.');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['pau', 'ps'],
  permLevel: 0
};

exports.help = {
  name: "pause",
  description: "pause the current music playing",
  usage: "pause"
}