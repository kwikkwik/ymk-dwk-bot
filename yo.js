const Discord = require("discord.js");
const client = new Discord.Client({ fetchAllMembers: true, disableEveryone: true});
const config = require("./config.json");
const fs = require("fs");
const path = require('path');
const moment = require("moment");

process.on('uncaughtException', (e)=>{
  const emb = new Discord.RichEmbed()
  .setColor('#FF0026')
  .addField('⛔ Uncaught Exception', `\`\`\`${e}\`\`\``);
  console.error(e);
  //client.channels.find('id', '464556069050515457').send() !== null ? client.channels.find('id', '464556069050515457').send(emb) : undefined;
});

process.on('unhandledRejection', (e, i) => {
  const emb = new Discord.RichEmbed()
  .setColor('#FF0026')
  .addField('⛔ Unhandle Rejection', `**At** : \`${i}\`\n\`\`\`${e}\`\`\``);
	console.log('😐 Unhandled Promise rejection at: ', i, 'reason: ', e);
	//client.channels.find('id', '464556069050515457').send() !== null ? client.channels.find('id', '464556069050515457').send(emb) : undefined;
});

const log = (msg) => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};

client.db = require('./util/database.js');
client.opus = require('./util/music/opusytdl.js');
client.snek = require('snekfetch');
client.req = require('request-promise-native');
client.assets = require('./util/handler/assets.js');
client.hastebin = require('./util/hastebin.js');
client.color = '#0071FF';

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.help = [];
let modules = fs.readdirSync('./cmd/').filter(file => fs.statSync(path.join('./cmd/', file)).isDirectory());
console.log(modules);
for (let module of modules) {
  console.log(`${module}`);
  client.help[modules.indexOf(module)] = {};
    client.help[modules.indexOf(module)]['name'] = require(`./cmd/${module}/${module}.json`).name;
    client.help[modules.indexOf(module)]['emoji'] = require(`./cmd/${module}/${module}.json`).emoji;
    client.help[modules.indexOf(module)]['command'] = [];

  let commandFiles = fs.readdirSync(path.resolve(`./cmd/${module}`)).
    filter(file => !fs.statSync(path.resolve('./cmd/', module, file)).isDirectory()).
    filter(file => file.endsWith('.js'));

  for (let file of commandFiles) {
    file = file.substr(0, file.length - 3);
    console.log(`└──${file}`);
    client.help[modules.indexOf(module)]['command'].push(`\`${file}\``);
    
    file = require(`./cmd/${module}/${file}`);
    
    client.commands.set(file.help.name.toLowerCase(), file);
    
    file.conf.module = module;

    for (let alias of file.conf.aliases) {
      client.aliases.set(alias.toLowerCase(), file.help.name);
    }
  }
}

fs.readdir("./events/", (err, files) => {
	if (err) console.error(err);
	files.forEach(file => {
		let eventFunc = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, (...args) => eventFunc.run(client, ...args));
	});
}); 

client.login(process.env.TOKEN);

client.reload = function(command) {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./cmd/${command}`)];
      let cmd = require(`./cmd/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });

      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = function(msg) {
  let permlvl = 0;
  let mod_role = msg.guild.roles.find("name", "Mods");
  if(mod_role && msg.member.roles.has(mod_role.id)) permlvl = 2;
  let admin_role = msg.guild.roles.find("name", "Devs");
  if(admin_role && msg.member.roles.has(admin_role.id)) permlvl = 3;
  if(msg.author.id === config.ownerid) permlvl = 4;
  return permlvl;
};