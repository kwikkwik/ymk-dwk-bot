const { guildQueue } = require('../../util/music/opusytdl.js');

exports.run = (client, msg, args = []) => {
	const serverQueue = guildQueue(msg.guild.id);
	if (!serverQueue) return msg.channel.send('..Not playing anything right now');
		return msg.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
		`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['q', 'queue'],
  permLevel: 0
};

exports.help = {
  name: "queue",
  description: "show current queue song",
  usage: "queue"
}