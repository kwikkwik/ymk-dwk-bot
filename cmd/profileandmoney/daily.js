const db = require('../../util/database.js');
const moment = require('moment');

exports.run = (client, msg, args) => {
  if(!db.userprof.has(msg.author.id)){
    db.userprof.set(msg.author.id, {
      tag: msg.author.id,
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
  if(db.userprof.getProp(msg.author.id, 'lastDay') !== moment().format('L')){
    db.userprof.setProp(msg.author.id, 'lastDay', moment().format('L'));
    const dailay = parseInt(db.userprof.getProp(msg.author.id, 'money'), 10);
    db.userprof.setProp(msg.author.id, 'money', dailay+10);
    msg.channel.send(`💰 ${msg.author} you get 10 in daily`);
  }else{
    msg.channel.send(`❗You can get daily again **${moment().endOf('day').fromNow()}**`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['dl', 'dailies'],
  permLevel: 0
};

exports.help = {
  name : "daily",
  description: "Let claim your daily",
  usage: "daily"
};