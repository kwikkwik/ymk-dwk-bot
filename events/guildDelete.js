const db = require('../util/database.js');
const embed = require('discord.js').RichEmbed;

exports.run = async (client, gld) => {
  const emb = new embed()
  .setColor(client.color)
  .setTitle('📤 Leaving the Server')
  .setThumbnail(gld.iconURL)
  .setDescription(`\n
**Server Name** : ${gld.name},
**Owner** : ${gld.owner.user.tag},
**Member Count** : ${gld.memberCount}
  `);
  setTimeout(() => client.channels.find('id', '465866896873619466').send(emb), 60000);
  db.setguild.delete(gld.id);
}