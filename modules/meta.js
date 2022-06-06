const { MessageEmbed } = require('discord.js')
const { format, generateList } = require('./tools')

module.exports = {
  help: async function (message, args) {
    // TODO Rewrite it so the bot shows the new commands automatically as they appear in main.js
    const meta = ['help', 'ping', 'posix', 'uptime']
    const utils = ['qr', 'roll', 'metar', 'taf', 'dice']
    const network = ['ip']
    const fun = ['op', 'bless', 'askgod', 'verse', 'kill', 'infect', 'yn', 'dox', 'give', 'kit', 'uuid', 'tp', 'helloworld', 'randomtp', 'randomtpall', 'yeet', 'randompaintp']
    const music = ['play', 'playlist', 'skip', 'stop', 'loop', 'volume', 'seek', 'queue', 'shuffle', 'pause', 'resume', 'remove', 'leave']

    const help = new MessageEmbed()
      .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
      .setTitle('Available Commands')
      // TODO add syntax to every command .setDescription("Use `help <command>` to get help on the specific command")
      .setTimestamp(Date.now)
      .addField('Meta', generateList(meta), false)
      .addField('Utils', generateList(utils), false)
      .addField('Network', generateList(network), false)
      .addField('Fun', generateList(fun), false)
      .addField('Music', generateList(music), false)
    help.setFooter('Melvin', 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp')
    return message.channel.send({ embeds: [help] })
  },

  ping: async function (message, args) {
    return message.channel.send(`Pong! Latency is ${Date.now() - message.createdTimestamp}ms.`)
  },

  posix: async function (message, args) {
    message.channel.send(`The current POSIX time is: ${Date.now()}ms (from 1/1/1970)`)
  },

  uptime: async function (message, args) {
    message.channel.send(`Bot's uptime is: ${format(process.uptime())}`)
  }
}
