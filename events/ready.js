const moment = require("moment");
const log = (msg) => { console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`); }
const snek = require('snekfetch');
const feed = require('../util/handler/newfeed.js');
const emb = require('discord.js').RichEmbed;


exports.run = async (client) => {
  const feedex = function(){ feed(client)};
  client.user.setActivity('k!h | No lewd me!', {type: 'STREAMING'});
  log(`Guideclient: Ready to serve ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`);
  client.setInterval(feedex, 300000);
}