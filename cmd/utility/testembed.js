exports.run = (client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No code provided', this.help);
	try{
		msg.channel.send(`🖨️ ${msg.author} **Here your embed look like**`, {embed: JSON.parse(args.join(' '))});
	}catch(e){
		const { RichEmbed } = require('discord.js');
		const emb = new RichEmbed()
		.setColor(client.color)
		.setTitle('❗Are you sure this is valid input ?')
		.setDescription(`\`\`\`${e.toString()}\`\`\``);
    msg.channel.send(emb);
	}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['testemb', 'tmb'],
  permLevel: 0
};

exports.help = {
  name : "testembed",
  description: "Let me parse the JSON to embed",
  usage: "testembed <some code>"
};