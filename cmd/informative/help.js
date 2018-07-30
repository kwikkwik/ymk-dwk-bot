const halp = require('../../util/help');
const { RichEmbed } = require('discord.js');
exports.run = (client, msg, args) => {
    if (!args[0]) {
      const emb = new RichEmbed()
      .setColor('#0071FF')
      .setAuthor('Konata\'s Command', client.user.avatarURL, client.user.avatarURL)
      .setFooter('💡 Tips! to know about a command use k!help <command name>');
      client.help.sort((a,b) => b.command.length - a.command.length).map(x => {
      	emb.addField(`${x.emoji} | ${x.name}`, x.command.join(', '))
      });
      msg.channel.send(emb);
  } else {
    
    let command = args[0];
    if(client.commands.has(command)) {
      command = client.commands.get(command);
    }else if(client.aliases.has(command)){
      command = client.commands.get(client.aliases.get(command));
    }
    
      const emb = new RichEmbed()
      .setColor(client.color)
      .setTitle(`❗Information for command ${command.help.name}`)
      .addField('📜 Description', command.help.description)
      .addField('❓Usage', command.help.usage)
      .addField('✂️Aliases', command.conf.aliases.length > 0 ? command.conf.aliases.join(', ') : 'none')
      .setFooter(`Requested by ${msg.author.username}`, msg.author.avatarURL);
      msg.channel.send(emb);
    
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name : "help",
  description: "Returns page details from root's awesome client guide.",
  usage: "help [command]"
}