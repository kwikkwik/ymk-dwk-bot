const curTalk = new Set();
const { userprof } = require('../../util/database.js');
const looting = ['l', 'o', '0', 't'];
const lotI = looting[Math.floor(Math.random()*4-1)];
const lotL = looting[Math.floor(Math.random()*4-1)];
const LotRof = looting[Math.floor(Math.random()*4-1)];

exports.run = (client, msg, args) => {
  if(curTalk.has(msg.author.id)) return msg.channel.send('Woah don\'t be greedy boy');
  if(lotI === lotL && lotI === LotRof){
    msg.reply('You got 10 in walkway');
    userprof.setProp(msg.author.id, 'money', userprof.getProp(msg.author.id, 'money')+10);
    curTalk.add(msg.author.id);
    setTimeout(()=> curTalk.delete(msg.author.id), 60000);
  }else{
    curTalk.add(msg.author.id);
    setTimeout(()=> curTalk.delete(msg.author.id), 60000);
    msg.reply('Nothing loot in here');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['lt', 'loo'],
  permLevel: 0
};

exports.help = {
  name : 'loot',
  description: "Check your loot",
  usage: "loot"
};