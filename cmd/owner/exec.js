const { exec } = require('child_process');
const { RichEmbed } = require('discord.js');

exports.run = (client, msg, args) => {
  if(msg.author.id !== require('../../config.json').ownerid) return;
  if(!args.join(' ')) return msg.channel.send('No parameter to execute. you\'re stuppid');
  let command = args.join(' ');
  const emb = new RichEmbed()
  .setColor(client.color)
  .addField('📥 INPUT', `\`\`\`bash\n${command}\`\`\``);
  exec(command, async ( error, stdout, stderr)=> {
  	if(stdout){
	  	let output = `\`\`\`bash\n${stdout}\`\`\``;
	  	if(stdout.length > 1024){
			const { body } = await client.snek.post('https://www.hastebin.com/documents').send(stdout);
			output = `https://www.hastebin.com/${body.key}.js`
		  }
			emb.addField('📤OUTPUT', output);
  	}else if(stderr){
	  	let error = `\`\`\`bash\n${stderr}\`\`\``;
	  	if(stderr.length > 1024){
			const { body } = await client.snek.post('https://www.hastebin.com/documents').send(stderr);
			error = `https://www.hastebin.com/${body.key}.js`
		  }
			emb.addField('⛔ERROR', error);
  	}else{
	  	emb.addField('📤OUPUT', '```bash\n# Command executed successfully but returned no output.```');
  	}
	  msg.channel.send(emb);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['bash', '$'],
  permLevel: 4
};

exports.help = {
  name : "exec",
  description: "Executes a command in the Terminal (Linux/macOS) or Command Prompt (Windows) and shows the output",
  usage: "exec <args>"
};