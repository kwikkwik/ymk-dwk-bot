const { RichEmbed } = require('discord.js');
const cuaca = require('weather-js');

exports.run = (client, msg, args) => {
  if(args.length < 1) return args.missing(msg, 'No query provided', this.help);
	cuaca.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
      if (err) msg.channel.send(err);
      if (result === undefined || result.length === 0) {
          msg.channel.send('**❗Please enter a location!**')
          return;
      }
      var current = result[0].current;
      var location = result[0].location;
      const embed = new RichEmbed()
          .setDescription(`**${current.skytext}**`)
          .setAuthor(`Weather for ${current.observationpoint}`)
          .setThumbnail(current.imageUrl)
          .setColor(client.color)
          .addField('⌛Timezone',`UTC${location.timezone}`, true)
          .addField('🌡️Temperature',`${current.temperature} °C`, true)
          .addField('🌡️Feels Like', `${current.feelslike} °C`, true)
          .addField('💨Winds',current.winddisplay, true)
          .addField('💧Humidity', `${current.humidity}%`, true)
          msg.channel.send(embed);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['wt', 'wet'],
  permLevel: 0
};

exports.help = {
  name : "weather",
  description: "Look weather in the given city name",
  usage: "weather <query>"
};