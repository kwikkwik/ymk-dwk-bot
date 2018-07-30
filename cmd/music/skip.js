const { guildQueue } = require('../../util/music/opusytdl.js');

exports.run = (client, msg, args = []) => {
	const serverQueue = guildQueue(msg.guild.id);
	if(!msg.member.voiceChannel) return msg.channel.send('❌You are not in a voice channel!');
	if(!serverQueue) return msg.channel.send('💤There is nothing playing that I could skip for you.');
	if(msg.author.id !== serverQueue.songs[0].author.id && serverQueue.connection.channel.members.length > 2){
    const number = parseInt(serverQueue.songs[0].vote, 10);
    serverQueue.songs[0].vote.set(number + 1);
    msg.reply(`You voted to skip this song ${serverQueue.songs[0].vote}/3`)
    .then(()=>{
      if(serverQueue.songs[0].vote !== 3) return;
      return serverQueue.connection.dispatcher.end('Skip has Returned');
    });
  }
  return serverQueue.connection.dispatcher.end('Skip command has been used!');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ski', 'sk'],
  permLevel: 0
};

exports.help = {
  name: "skip",
  description: "skip the current music playing",
  usage: "skip"
}