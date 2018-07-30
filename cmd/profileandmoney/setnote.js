const db = require('../../util/database.js');

exports.run = (client, msg, args) => {
  if(args.length < 1) return args.missing(msg, 'No text added', this.help);
  if(!db.userprof.has(msg.author.id)){
    db.userprof.set(msg.author.id, {
      tag: msg.author.id,
  rep: 0,
  level: 0,
  xp: 0,
  money: 0,
  badge: '',
  note: args.join(' ')
    })
  }
  db.userprof.setProp(msg.author.id, 'note', args.join(' '));
  msg.react('✅');
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sn'],
  permLevel: 0
};

exports.help = {
  name : "setnote",
  description: "set your note",
  usage: "setnote <text>"
};