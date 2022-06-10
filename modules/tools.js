const { MessageEmbed } = require('discord.js')

module.exports = {
  randomIntFromInterval: function (min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  generateError: function (ctx, message) {
    const error = new MessageEmbed()
      .setColor('#FF0000')
      .setTitle('An error occured')
      .setTimestamp(Date.now)
      .setDescription(message)
      .setFooter({ text: 'Melvin', icon: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })

    return ctx.channel.send({ embeds: [error] })
  },

  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  format: function (seconds) {
    let years = Math.floor(seconds / 60 / 60 / 24 / 7 / 52)
    let weeks = Math.floor(seconds / 60 / 60 / 24 / 7) % 52
    let days = Math.floor(seconds / 60 / 60 / 24) % 7
    let hours = Math.floor(seconds / 60 / 60) % 24
    let minutes = Math.floor(seconds / 60) % 60
    seconds = Math.floor(seconds % 60)

    years = (years > 0) ? `${years}y ` : ''
    weeks = (weeks > 0) ? `${weeks}w ` : ''
    days = (days > 0) ? `${days}d ` : ''
    hours = (hours > 0) ? `${hours}h ` : ''
    minutes = (minutes > 0) ? `${minutes}m ` : ''
    seconds = (seconds > 0) ? `${seconds}s` : ''

    return years + weeks + days + hours + minutes + seconds
  },

  generateEmbed: function (message, title, description, url, duration, image) {
    let desc
    if (typeof duration === 'undefined') {
      desc = `[${description}](${url})`
    } else {
      desc = `[${description}](${url}) \n \`[0:00 / ${duration}]\``
    }

    const embed = new MessageEmbed()
      .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
      .setTitle(title)
      .setThumbnail(image)
      .setDescription(desc)
      .setTimestamp(Date.now)
      .setFooter({ text: 'Melvin', icon: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })

    return message.channel.send({ embeds: [embed] })
  },

  generateList: function (array) {
    let string = ''
    for (let i = 0; i < array.length; i++) {
      string += `\`${array[i]}\` `
    }
    return string.trimEnd()
  }
}
