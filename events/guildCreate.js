const config = require('../config');
const db = require('../util/database.js').util.newGuild;
const embed = require('discord.js').RichEmbed;

exports.run = async (client, gld) => {
  db(gld.id);
  const emb = new embed()
  .setColor(client.color)
  .setTitle('📥 Joining new server')
  .setThumbnail(gld.iconURL)
  .setDescription(`\n
**Server Name** : ${gld.name},
**Owner** : ${gld.owner.user.tag},
**Member Count** : ${gld.memberCount}
  `);
  setTimeout(() => client.channels.find('id', '465866896873619466').send(emb), 60000);
}