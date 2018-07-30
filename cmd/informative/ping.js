exports.run = (client, msg, args = []) => {
  msg.channel.send('Ping?')
    .then(message => {
      message.edit(`Pong 🏓 **${message.createdTimestamp - msg.createdTimestamp}ms**`);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['pi', 'pong', 'plank'],
  permLevel: 0
};

exports.help = {
  name: "ping",
  description: "Ping/Pong command. I wonder what this does? /sarcasm",
  usage: "ping"
}