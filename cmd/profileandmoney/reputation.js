const db = require('../../util/database.js');
const moment = require('moment');

exports.run = (client, msg, args) => {
	const user = msg.mentions.users.first() || client.users.get(args[0]);
    if(!user) return msg.reply("You must mention someone or give their ID!");
    if(user.bot) return msg.reply("🤖 Bot doesn\'t have profile");
    if(user.id === msg.author.id) return msg.reply("You cant give rep point to yourselft");
  if(!db.userprof.has(user.id)){
    db.userprof.set(user.id, {
      tag: user.id,
    	badge: '',
    	rep: 1,
    	level: 0,
    	xp: 0,
      money: 0,
    	note: 'Im funny person in here',
      lastDay: '',
      lastWeek: '',
      songs: []
    });
  }
  if(db.userprof.getProp(msg.author.id, 'lastWeek') !== moment().format('L')){
    db.userprof.setProp(msg.author.id, 'lastWeek', moment().format('L'));
    const repussy = parseInt(db.userprof.getProp(user.id, 'rep'), 10);
    db.userprof.setProp(user.id, 'rep', repussy+1);
    msg.channel.send(`🔸 ${user} you get rep point from ${msg.author}`);
  }else{
    msg.channel.send(`❗You can give rep again **${moment().endOf('day').fromNow()}**`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['rep', 'rp'],
  permLevel: 0
};

exports.help = {
  name : "reputation",
  description: "give people a reputation",
  usage: "reputation <mention someone or give their id>"
};