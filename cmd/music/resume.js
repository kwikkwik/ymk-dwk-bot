const { guildQueue } = require('../../util/music/opusytdl.js');

exports.run = (client, msg, args = []) => {
	const serverQueue = guildQueue(msg.guild.id);
	if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('✅ Resumed the music for you!');
		}
		return msg.channel.send('💤 There is nothing playing.');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['res', 'rs'],
  permLevel: 0
};

exports.help = {
  name: "resume",
  description: "resume the current music playing",
  usage: "resume"
}