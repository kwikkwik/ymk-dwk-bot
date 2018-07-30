const db = require('../../util/database.js');
const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args = []) => {
	let user;
    if (msg.mentions.users.size) { user = msg.mentions.users.first(); }
    else if (args[0]) { user = await msg.guild.fetchMember(args[0]);
      if (user) { user = user.user; } }
    if (!user) { user = msg.author; }
    if(user.bot) return msg.channel.send('🤖 **Bot doesn\'t have profile**');
    if(!db.userprof.has(user.id)) {
    	db.userprof.set(user.id, {
      tag: user.id,
    	badge: '',
    	rep: 0,
    	level: 0,
    	xp: 0,
      money: 0,
    	note: 'Im funny person in here',
      lastDay: '',
      lastWeek: '',
      songs: []
    });
   }
	const procfile = db.userprof.get(user.id);
	const pi = parseInt(procfile.xp, 10);
  let strlvltoint = parseInt(procfile.level, 10);
	const nextLev = (++strlvltoint)*10;
  const endpi = nextLev*nextLev;
	const piPercent = Math.floor((pi/endpi)*9);
	
	const embed = new RichEmbed()
  .setColor('#0071FF')
	.setTitle('📜 User Profile Card for ' + user.tag)
  .setThumbnail(user.avatarURL)
	.addField('Reputation', procfile.rep, true)
	.addField('Level', procfile.level, true)
	.addField('XP', `${progresBar(piPercent)} (${procfile.xp})`, true)
	.addField('Money', `💵${procfile.money}`, true)
	.addField('Notes', `${procfile.note}`, true)
	.addField('Badge', `${procfile.badge ? procfile.badge : 'none'}`, true)
	
	msg.channel.send({embed});
}

const barW = ['<:w:462204365382352899>', '<:w:462204255084740618>', '<:w:462204074591518730>' ];
const barG = ['<:g:462204621201473536>', '<:g:462204542944018432>', '<:g:462204583180238849>'];

function progresBar(init){
	if(init === 1){
		return `${barG[0]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[2]}`;
	}else if(init === 2){
		return `${barG[0]}${barG[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[2]}`;
	}else if(init === 3){
		return `${barG[0]}${barG[1]}${barG[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[2]}`;
	}else if(init === 4){
		return `${barG[0]}${barG[1]}${barG[1]}${barG[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[2]}`;
	}else if(init === 5){
		return `${barG[0]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barW[1]}${barW[1]}${barW[1]}${barW[2]}`;
	}else if(init === 6){
		return `${barG[0]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barW[1]}${barW[1]}${barW[2]}`;
	}else if(init === 7){
		return `${barG[0]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barW[1]}${barW[2]}`;
	}else if(init === 8){
		return `${barG[0]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barW[2]}`;
	}else if(init === 9){
		return `${barG[0]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[1]}${barG[2]}`;
	}else{
		return `${barW[0]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[1]}${barW[2]}`;
	}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['prof', 'me'],
  permLevel: 0
};

exports.help = {
  name : "profile",
  description: "Returns your profile or mention user",
  usage: "profile"
};