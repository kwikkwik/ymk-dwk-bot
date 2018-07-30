const { guildQueue } = require('../../util/music/opusytdl.js');

exports.run = (client, msg, args = []) => {
	const serverQueue = guildQueue(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send('❌You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('💤There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['st', 'sto'],
  permLevel: 0
};

exports.help = {
  name: "stop",
  description: "stop the current music playing",
  usage: "stop"
}