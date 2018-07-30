const queue = new Map();
const ytdl = require('ytdl-core');
const { RichEmbed } = require('discord.js');

exports.handleVideo = async (video, msg, voiceChannel, playlist = false) => {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: video.title,
		thumbnail: video.thumbnails.high.url,
    channel: video.channel.title,
    description: video.description,
    duration: video.duration,
    author: msg.author,
    vote: 0,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
      const embed = new RichEmbed()
      .setColor('#0071FF')
      .setDescription(`✅ Added to queue : **${song.title}** by **${song.author.username}**`)
      .setThumbnail(song.thumbnail);
			msg.channel.send(embed).then(m => m.delete(10000));
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
    const embed = new RichEmbed()
    .setColor('#0071FF')
    .setAuthor(`✅ Added to queue : **${song.title}** by **${song.author.username}**`)
    .setThumbnail(song.thumbnail)
		if (!playlist) return msg.channel.send(embed).then(m => m.delete(10000));
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url, {quality: 'highestaudio', filter: 'audioonly'}),
                                                       {inlineVolume: true, sampleRate: 96000})
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Now Playing : **${song.title}**`);
}

exports.guildQueue = (id) => queue.get(id);

exports.setQueue = (key, prop) => queue.set(key, prop);