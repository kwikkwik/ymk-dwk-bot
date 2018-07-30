const {RichEmbed} = require('discord.js');
const moment = require('moment');

exports.run = (client, msg, args) => {
	const {user, member} = userResolvable(msg, args[0]);
	if(!user) return;
	
	const ctx = new RichEmbed()
	.setColor(client.color)
	.setThumbnail(user.avatarURL)
	.setAuthor(user.tag, user.avatarURL)
	.addField('📟 ID', user.id, true)
	.addField('🏷️ Nickname', !member.nickname ? 'None' : member.nickname, true)
	.addField('📅 Created At', moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss'), true)
	.addField('📆 Joined Server', moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss'), true)
	.addField('🤖 Is Bot ?', `Im 95% sure this is ${user.bot ? 'Bot!' : 'Not Bot!'}`, true)
	.addField('🕯️Presence', `
**Status** : ${user.presence.status},
**Game**: ${user.presence.game ? user.presence.game.name : 'None'}
	`, true)
	.addField('🎲 Roles', member.roles.array().slice(1).join(', '), true)
	.addField('🔑 Permissions', Object.keys(member.permissions.serialize).filter(x => member.permissions.serialize[x] === true).join(', '), true);
	msg.channel.send(ctx);
};

function userResolvable (msg, args){
	let user;
	if(msg.mentions.users.size){ user = msg.mentions.users.first() }
	else if(args){ user = msg.guild.fetchMember(args);
		if(user) { user = user } }
	if(!user){ user = msg.member }
	return {
		member: user,
		user: user.user
	}
}


exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['whois'],
  permLevel: 0
};

exports.help = {
  name : "userinfo",
  description: "Look information about acount",
  usage: "userinfo <user>"
};