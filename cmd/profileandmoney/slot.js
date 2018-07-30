const { userprof } = require('../../util/database.js');

exports.run = (client, msg, args) => {
  if(!args[0]){
  	if(userprof.getProp(msg.author.id, 'money') < 1) return msg.channel.send('**You dont have money sad 😭**').then(() => msg.react('🇫'));
  	slot(msg, 1);
  }else{
  	if(isNaN(args[0])) return msg.channel.send('please add valid number');
      if(userprof.getProp(msg.author.id, 'money') < args[0]) return msg.channel.send(`**You dont have ${args[0]} check your balance !**`);
    slot(msg, args[0]);
  }
};

async function slot(msg, taruhan){
  const buah = ['🍇', '🍉', '🍊', '🍋', '🍍', '🍎', '🍓', '🥕', '🥔', '🍆', '🥑', '🍅'];
  const ji = buah[Math.floor(Math.random()*buah.length)];
  const wa = buah[Math.floor(Math.random()*buah.length)];
  const tu = buah[Math.floor(Math.random()*buah.length)];
  const uang = Math.floor(Math.random()* 1000);
  const vodka = await msg.channel.send('Slot....');
  
  let pesan;
  if(ji === wa && ji === tu){
    userprof.setProp(msg.author.id, 'money', userprof.getProp(msg.author.id, 'money') +uang);
    pesan = `📣 **You Slot and Got** ${uang}`
  }else{
    userprof.setProp(msg.author.id, 'money', userprof.getProp(msg.author.id, 'money') -taruhan);
    pesan = `📣 **You Slot and Lose** ${taruhan}`
  }
  
  for(let i = 0; i<3; i++){
  if(i === 2){
     vodka.edit(buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + '\n' + ji + ' | ' + wa + ' | ' + tu + '<\n' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + '\n ▪' + pesan);
    } else {
     vodka.edit(buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + '\n' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + '<\n' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)] + ' | ' + buah[Math.floor(Math.random()*buah.length)])
    }
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sl', 'slo'],
  permLevel: 0
};

exports.help = {
  name : "slots",
  description: "Bet your money",
  usage: "slots"
};