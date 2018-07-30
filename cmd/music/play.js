const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.APIYOU);
const { handleVideo } = require('../../util/music/opusytdl.js');
const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args = []) => {
 const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	
  let aink = msg.author.id;
  let index = 0;
	if(args.length < 1) return args.missing(msg, 'No link or query or playlist provided', this.help);
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('❌I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('❌ cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('❌ cannot speak in this voice channel, make sure I have the proper permissions!');
		}
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`).then(m => m.delete(60000));
		} else {
		try{
			const video = await youtube.getVideo(url);
			handleVideo(video, msg, voiceChannel);
		} catch (e) {
		try{
			    var videos = await youtube.searchVideos(args.join(' '), 4);
				const oneUrl = await youtube.getVideoByID(videos[0].id);
				const twoUrl = await youtube.getVideoByID(videos[1].id);
				const threeUrl = await youtube.getVideoByID(videos[2].id);
				const fourUrl = await youtube.getVideoByID(videos[3].id);
        const embed = new RichEmbed()
        .setColor('#0071FF')
        .setDescription(videos.map(video2 => `${++index}\u20E3 - [${video2.title}](${video2.shortURL})`).join('\n'));
				msg.channel.send('🎵 **Song Selection**', {embed}).then( m => { m.react('1⃣').then(() => m.react('2⃣')).then(() => m.react('3⃣')).then(() => m.react('4⃣')).then(() => m.react('❌'))
                const filter = (reaction, user) => {
               return ['1⃣', '2⃣', '3⃣', '4⃣', '❌'].includes(reaction.emoji.name) && user.id === aink;
                };
                m.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                	 const reaction = collected.first();
                    if (reaction.emoji.name === '1⃣') {
                    	handleVideo(oneUrl, msg, voiceChannel);
                        msg.react('✅');
                        m.delete();
                    	}
                    if (reaction.emoji.name === '2⃣') {
                    	handleVideo(twoUrl, msg, voiceChannel);
                        msg.react('✅');
                        m.delete();
                    	}
                    if (reaction.emoji.name === '3⃣') {
                    	handleVideo(threeUrl, msg, voiceChannel);
                        msg.react('✅');
                        m.delete();
                    	}
                    if (reaction.emoji.name === '4⃣') {
                    	handleVideo(fourUrl, msg, voiceChannel);
                        msg.react('✅');
                        m.delete();
                    	}
                    if (reaction.emoji.name === '❌') {
                    	msg.react('✅');
                    	m.delete();
                    	}
                	}).catch(e => m.delete().then(() => msg.channel.send('⏱ You took to long to reply')));
                 });
		} catch (e) {
			console.log(e)
			}}}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['p', 'pl'],
  permLevel: 0
};

exports.help = {
  name: "play",
  description: "Play a music on youtube",
  usage: "play <title or playlist or video link>"
}