const config = require('../config.json');
const db = require('../util/database.js');
const defaultSettings = {
  dj: false,
  notify: false,
  prefix: config.prefix,
  notifychannel: 0,
  welcome: 'Hi %USER% welcome to %GUILD%',
  leave: 'Oh no %USER% leave ._.',
  tfeed: []
}

exports.run = async (client, msg) =>  {
  if(msg.author.bot) return;
  if(!db.userprof.has(msg.author.id)){
     db.userprof.set(msg.author.id, {
  tag: msg.author.id,
  rep: 0,
  level: 0,
  xp: 0,
  money: 0,
  badge: '',
  note: 'Im funny person in here',
  lastDay: '',
  lastWeek: '',
  songs: []
});
  }
  
  if(!db.setguild.has(msg.guild.id)) {
    db.util.newGuild(msg.guild.id);
  }
  
	const guildConf = db.setguild.get(msg.guild.id) || defaultSettings;
  
  if(msg.guild){
    if(msg.author.bot) return;
    let currentPoints = db.userprof.getProp(msg.author.id, 'xp');
    db.userprof.setProp(msg.author.id, 'xp', ++currentPoints);
    const curLevel = Math.floor(0.1 * Math.sqrt(currentPoints));
    if (db.userprof.getProp(msg.author.id, 'level') < curLevel) {
      //msg.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
      db.userprof.setProp(msg.author.id, 'level', curLevel);
    }
  }
  const mention = `<@${client.user.id}>`;
  const chat = msg.content.slice(mention.length).split(' ');
  if(msg.content.startsWith(`${mention}`)){
    if(chat.join(' ')){
      msg.channel.startTyping();
      const body = await client.req({url:`https://some-random-api.ml/chatbot/?message=${chat.join(' ')}`, json:true});
      msg.reply(body.response).then(()=> msg.channel.stopTyping());
    }
    return;
  }
	
  if (!msg.content.startsWith(guildConf.prefix) || msg.author.bot ) return;
  let command = msg.content.split(" ")[0].slice(guildConf.prefix.length);
  let args = msg.content.split(" ").slice(1);
  let perms = client.elevation(msg);
  msg.prefix = guildConf.prefix;
  
  args.missing = function(mslg, reason, that){
    const embd = require('discord.js').RichEmbed;
    const emb = new embd()
    .setColor('#FF0026')
    .setDescription(`
❕**Reason**
\`\`\`${reason}\`\`\`
<:commandJS:466981526966501386> **Usage**
\`\`\`${guildConf.prefix}${that.usage}\`\`\`
`)
    .setFooter('💡 For more information use '+msg.prefix+'help '+that.name);
    mslg.reply(`**It's not how you use ${msg.prefix}${that.name}**`, {embed: emb});
  };
  
  
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    try{
    cmd.run(client, msg, args, perms);
    process.on('unhandledRejection', e => {
	    const EMBED = require('discord.js').RichEmbed;
		const embed = new EMBED()
		.setColor('#FF0026')
		.addField('⛔ Unhadled Rejection', `\`\`\`ini\n${e.stack || e }\`\`\``);
		client.channels.get('464556069050515457').send(embed);
    });
    }catch(e){
      const EMBED = require('discord.js').RichEmbed;
      const embed = new EMBED()
      .setColor('#FF0026')
      .addField('⛔ Uncaught Exception', `\`\`\`ini\n${e.stack || e }\`\`\``);
      client.channels.get('464556069050515457').send(embed);
    }
  }
}