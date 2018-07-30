const {RichEmbed, version} = require('discord.js');
const { prefix } = require('../../config.json');
exports.run = (client, msg, args) => {
	let uptime = client.uptime;
    if (uptime instanceof Array) {
      uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
    }
    let seconds = uptime / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    uptime = `${seconds}s`;
    if (days) {
      uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    else if (hours) {
      uptime = `${hours}h ${minutes}m ${seconds}s`;
    }
    else if (minutes) {
      uptime = `${minutes}m ${seconds}s`;
    }
    
    let rss = process.memoryUsage().rss
    if(rss instanceof Array){
    	rss = rss.reduce((sum, val) => sum + val, 0);
    }
    let heapused = process.memoryUsage().heapUsed
	if(heapused instanceof Array){
		heapused = heapused.reduce((sum, val) => sum + val, 0);
	}
	
  let mbed = new RichEmbed()
  .setColor(client.color)
  .setAuthor('Current Statistic for Konata\'s', client.user.avatarURL)
  .setDescription(`
❗ **Default Prefix** : ${prefix},
🕒 **Uptime** : ${uptime},
💎 **Shard** : ${client.shard ? client.shard.count : 'None' },
<:commandJS:466981526966501386> **Loaded Command** : ${client.commands.size},
🏠 **Guilds** : ${client.guilds.size},
#️⃣ **Channels** : ${client.channels.size},
👥 **User** : ${client.users.size},
🏓 **Websocket Ping** : ${client.ping}ms,
<:discordJS:466983381318762496> **Discord.js Version** : ${version},
<:nodeJS:466968802668707843> **Node.js Version** : ${process.version}
`)
.addField('🗄️ Memory', `
📈 **RSS** : ${(rss / 1024 / 1024).toFixed(2)} MB
📈 **Heap** : ${(heapused / 1024 / 1024).toFixed(2)} MB
`);
  msg.channel.send(mbed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['stats', 'statistic'],
  permLevel: 0
};

exports.help = {
  name : "status",
  description: "Shows detailed stats and info of Konata",
  usage: "status"
};