exports.run = async(client, msg, args) => {
	if(args.length < 1) return args.missing(msg, 'No link provided', this.help);
	const fetchMessage = await msg.channel.send('🔎Fetching...');
	msg.channel.startTyping();
  try{
	const web = await client.req({url: `https://farzain.com/api/webcheck.php?q=${args[0]}&apikey=${process.env.FARKEY}`, json:true});
	const weeb = web.stats;
	
	if(!weeb) fetchMessage.edit('❌ **Sorry but i can\'t find your web**');
	const { RichEmbed } = require('discord.js');
	const emb = new RichEmbed()
	.setColor(client.color)
	.setTitle('Webcheck')
	.setDescription(`
**Number Resources** : ${weeb.numberResources.toLocaleString()}
**Number Hosts** : ${weeb.numberHosts.toLocaleString()}
**Total Request Bytes** : ${weeb.totalRequestBytes.toLocaleString()}
**Number Static Resources** : ${weeb.numberStaticResources.toLocaleString()}
**HTML Response Bytes** : ${weeb.htmlResponseBytes.toLocaleString()}
**CSS Response Bytes** : ${weeb.cssResponseBytes.toLocaleString()}
**Javascript Response Bytes** : ${weeb.javascriptResponseBytes.toLocaleString()}
**Image Response Bytes** : ${weeb.imageResponseBytes.toLocaleString()}
**Other Response Bytes** : ${weeb.otherResponseBytes.toLocaleString()}
**Number Javascript Resources** : ${weeb.numberJsResources.toLocaleString()}
**Number CSS Resources** : ${weeb.numberCssResources.toLocaleString()} `)
	.setFooter('Powered by Google', 'http://i.imgur.com/b7k7puJ.jpg');
	
	msg.channel.send(emb).then(()=> {fetchMessage.delete(); msg.channel.stopTyping()});
  }catch(e){
    msg.channel.stopTyping();
    fetchMessage.edit('<:konataCry:458808962259746826> Sorry this web can\'t be fetched');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['webc', 'checkweb'],
  permLevel: 0
};

exports.help = {
  name : "webcheck",
  description: "Check statistic web",
  usage: "webcheck <link>"
};