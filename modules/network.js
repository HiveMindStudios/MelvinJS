const { default: axios } = require('axios')
const { generateError } = require('./tools')
const { MessageEmbed } = require('discord.js')

module.exports = {
  ip: async function (message, args) {
    const urlIp = `http://ip-api.com/json/${args[1]}`
    axios.get(urlIp).then(res => {
      const ipInfo = new MessageEmbed()
        .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
        .setTitle('IP Address Info')
        .setTimestamp(Date.now)
        .addField('Address:', res.data.query, false)
        .addField('Location:', `${res.data.city}, ${res.data.regionName}, ${res.data.country} (${res.data.lat} ${res.data.lon})`, false)
        .addField('Timezone:', res.data.timezone, false)
        .addField('Organization:', res.data.org, false)
        .addField('ISP:', res.data.isp, false)
        .setFooter({ text: 'Melvin', iconURL: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })

      return message.channel.send({ embeds: [ipInfo] })
    }).catch(err => {
      console.log(err)
      generateError(message, `${args[1]} is not a valid IP Address or Domain`)
    })
  }
}
