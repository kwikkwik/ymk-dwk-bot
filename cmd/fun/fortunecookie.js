exports.run = (client, msg, args) => {
  const word = require('../../ast/data/fortunecookie.json');
  const fortune = word[Math.floor(Math.random()*word.length)-1];
  msg.channel.send(`🍪 | **${fortune}**`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['fc', 'fcookie'],
  permLevel: 0
};

exports.help = {
  name : "fortunecookie",
  description: "open your cookie and look the fortune :)",
  usage: "fortunecookie"
};