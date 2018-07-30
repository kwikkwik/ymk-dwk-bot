exports.run = async (client, msg, args) => {
   if(!args[0]){
	const { RichEmbed } = require('discord.js');
    let emo = await msg.guild.emojis.array();
     if(!emo) return msg.channel.send('This server doesn\'t has any emoji');
     if(emo.length < 10){
       const embed = new RichEmbed()
       .setDescription(emo.map((x,i) => `\`${i+1}\` - ${x} - \`<:${x.name}:${x.id}>\``).join('\n'))
       .setColor('#0071FF');
       return msg.channel.send(embed);
     }
	let emolist = [];
    let page = 1;
    for(let i = 0; i<= Math.ceil(emo.length/10); i++){
      emolist.push(emo.splice(0,10).map((x, j) => `\`${j+i}\` -${x} - \`<:${x.name}:${x.id}>\``).join('\n'));
    }
	const embed = new RichEmbed() 
	 .setColor('#0071FF')
	 .setFooter(`Page ${page} of ${emolist.length}`) 
	 .setDescription(emolist[page-1])
 
  msg.channel.send(embed).then(m => { 
   
    m.react('⬅').then( r => { 
      m.react('➡');
     
      const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === msg.author.id;
      const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === msg.author.id; 
     
      const backwards = m.createReactionCollector(backwardsFilter, { time: 60000 }); 
      const forwards = m.createReactionCollector(forwardsFilter, { time: 60000 }); 
     
      
      backwards.on('collect', r => { 
        if (page === 1) return;
        page--; 
        embed.setDescription(emolist[page-1]); 
        embed.setFooter(`Page ${page}`+'/'+`${emolist.length}`); 
        m.edit(embed)
        .then(()=> m.reactions.first().remove(msg.author.id))
      })
     
      forwards.on('collect', r => { 
        if (page === emolist.length) return; 
        page++; 
        embed.setDescription(emolist[page-1]); 
        embed.setFooter(`Page ${page}`+'/'+`${emolist.length}`); 
        m.edit(embed)
        .then(()=>m.reactions.last().remove(msg.author.id))
      })
    })
  })
}else{

   const argmoji = args[0].toLowerCase();
   if(argmoji === 'cemoji' || argmoji === 'c'){
   	if(!msg.member.hasPermission('MANAGE_EMOJIS')) return;
       const linkCheck = /https?:\/\/.+\.(?:png|jpg|jpeg|gif)/gi;
       if(!args[1]) return msg.reply('❌**Please give name to your emoji**');
       if(!msg.attachments && !args[2]) return msg.reply('❌**Please send Image or give link image**');
       if(msg.attachments.first()){
       	if (!linkCheck.test(msg.attachments.first().url)) return msg.reply('❌ **Please give a valid image**');
       	const c = await msg.guild.createEmoji(msg.attachments.first().url, args[1]);
	       msg.channel.send(`<:${c.name}:${c.id}> ` + '`<:' + c.name + ':' + c.id + '>`');
       } else if(args[2]){
        if(!linkCheck.test(args[2])) return msg.reply('❌ **Please give a valid image link**');
       	const c = await msg.guild.createEmoji(args[2], args[1]);
           msg.channel.send(`<:${c.name}:${c.id}> ` + '`<:' + c.name + ':' + c.id + '>`');
       }
   }
 }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['em', 'emo'],
  permLevel: 0
};

exports.help = {
  name : "emoji",
  description: "Show emoji in this server",
  usage: "emoji"
};