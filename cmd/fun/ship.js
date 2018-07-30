const { Canvas } = require('canvas-constructor');

exports.run = async (client, msg, args) => {
	let users = msg.mentions.users.map(u => u);
	if(users.length < 2) return args.missing(msg, 'no user mentioned or mention user less than 2', this.help);
	let shipname = '';
	for(let i = 0; i < 2; i++){
		shipname += `${users[i].username.substring(0, users[i].username.length / 2)}`
	}
	let percent = Math.floor(Math.random()*100);
	if(percent < 60){
		percent = `__**${shipname}**__\n❤ **${percent}% Not Bad** `;
	}else if(percent > 60 && percent < 89){
		percent = `__**${shipname}**__\n❤ **${percent}% A Lovely Ship** `;
	}else if(percent > 89){
		percent = `__**${shipname}**__\n❤ **${percent}% Perfect!** `;
	}
	if(!users[0].avatarURL && !users[1].avatarURL) return msg.channel.send(percent);
    const m = await msg.channel.send('🖌️Painting...');
    msg.channel.startTyping();
    const image = await getShip(client, users[0].avatarURL, users[1].avatarURL);
    const { RichEmbed } = require('discord.js');
    const emb = new RichEmbed()
    .setColor(client.color)
    .setDescription(percent)
    .attachFile({attachment:image, name:'ss.jpg'})
    .setImage('attachment://ss.jpg');
    msg.channel.send(emb).then(()=> { msg.channel.stopTyping(); m.delete();});
};

async function getShip(client, ship1, ship2){
	const link = /\.gif.+/g;
	const user1 = await client.snek.get(ship1.replace(link, '.jpg'));
	const user2 = await client.snek.get(ship2.replace(link, '.jpg'));
  const moe = await client.snek.get('https://cdn.glitch.com/efe3bf10-38d3-4ce6-b72c-a74e2a6b50f6%2F1530760219.png?1530760650106');
	return new Canvas(256, 128)
    .setColor(client.color)
    .addImage(user1.body, 0, 0, 128, 128)
    .addImage(user2.body, 128, 0, 128, 128)
    .addImage(moe.body, 106, 51, 44, 38)
    .toBuffer();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name : "ship",
  description: "Ship two user",
  usage: "ship <user1> <user2>"
};