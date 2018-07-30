const { ownerid } = require('../../config');
const { RichEmbed } = require('discord.js');
const { post } = require('snekfetch');

exports.run = async (client, msg, args = []) => {
  const emb = new RichEmbed()
  .setColor(client.color)
  .addField('📥 INPUT', '```js\n'+ args.join(' ') +'```');
  
  if(msg.author.id !== ownerid ) return;
  try {
      const code = args.join(' ');
      let evaled = eval(code);

      if (typeof evaled !== 'string')
        evaled = require('util').inspect(evaled);
      let output = clean(evaled);
      if(output.length > 1024){
        const { body } = await post('https://www.hastebin.com/documents').send(output);
        emb.addField('📤 OUTPUT', `https://www.hastebin.com/${body.key}.js`);
      }else{
        emb.addField('📤 OUTPUT', '```\n'+ output +'```');
      }

      msg.channel.send(emb);
    } catch (err) {
      let error = clean(err);
      if(error.length > 1024){
        const { body } = await post('https://www.hastebin.com/documents').send(error);
        emb.addField('❌ERROR', `https://www.hastebin.com/${body.key}.js`);
      }else{
      emb.addField('❌ERROR', '```\n'+ error +'```');
      }
      msg.channel.send(emb);
    }
};

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['e', 'ev', '@'],
  permLevel: 4
};

exports.help = {
  name: "eval",
  description: "let eval your msg",
  usage: "eval <code>"
}