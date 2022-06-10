const { MessageEmbed } = require('discord.js')
const { format, generateList, generateError } = require('./tools')
const documentation = require('../documentation.json')

module.exports = {
  help: async function ({ network, utils, fun, meta, music }, message, args) {
    args.shift()
    if (args.join('').trim().replace(/\s/, '').length === 0) {
      const help = new MessageEmbed()
        .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
        .setTitle('Available Commands')
        .setDescription('Type $help <command> to show info about a specific command')
        .setTimestamp(Date.now)
        .addField('Meta', generateList(Object.keys(meta)), false)
        .addField('Utils', generateList(Object.keys(utils)), false)
        .addField('Network', generateList(Object.keys(network)), false)
        .addField('Fun', generateList(Object.keys(fun)), false)
        .addField('Music', generateList(Object.keys(music)), false)
      help.setFooter({ text: 'Melvin', iconURL: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })
      return message.channel.send({ embeds: [help] })
    } else {
      let cmd = ''
      try {
        cmd = documentation[Object.keys(documentation).filter(key => key === args.join(' ').toLowerCase()).toString()]
        const helpSyntax = new MessageEmbed()
          .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
          .setTitle(`$${args.join(' ').toLowerCase()} command`)
          .setDescription(cmd.description)
          .addField('Usage', `\`${cmd.syntax}\``, false)
          .setTimestamp(Date.now)
        helpSyntax.setFooter({ text: 'Melvin', iconURL: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })
        return message.channel.send({ embeds: [helpSyntax] })
      } catch (err) {
        generateError(message, "Unknown command (or documentation doesn't exist yet)! Type $help for a list of commands.")
      }
    }
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
