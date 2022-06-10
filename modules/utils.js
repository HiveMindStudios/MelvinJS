const axios = require('axios').default
const { randomIntFromInterval, generateError } = require('./tools.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
  qr: async function (message, args) {
    args.shift()
    args = args.join(' ')
    args = encodeURIComponent(args)
    if (typeof args !== 'string') return generateError(message, 'Please provide data to create QR code!')
    else {
      const qrCode = new MessageEmbed()
        .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
        .setTitle("Here's your QR code!")
        .setURL(`http://api.qrserver.com/v1/create-qr-code/?data=${args}&size=1000x1000&ecc=Q&margin=8`)
        .setTimestamp(Date.now)
        .setImage(`http://api.qrserver.com/v1/create-qr-code/?data=${args}&size=256x256&ecc=Q&margin=8`)
        .setFooter({ text: 'Melvin', icon: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })
      return message.channel.send({ embeds: [qrCode] })
    }
  },

  dice: async function (message, args) {
    const int = Math.floor(Math.random() * (6 - 1) + 1)
    message.channel.send(int.toString())
  },

  roll: async function (ctx, data) {
    // ? Available actions: kl(Keep lower), kh (Keep highest), r (Minimum roll)
    if (typeof data[1] === 'undefined') data[1] = '2d20kl1+3'
    //* roll-> 0: full roll(string) 1: sign(string) 2: dice amount 3: dice size 4: action(string) 5: action amount
    const roll = [...data[1].matchAll(/(\+|-|\/|\*)?([\d]*)d([\d]*)(kh|kl|r)?([\d])*/g)][0]
    //* modifiers-> 0: full mod(string) 1: sign(string) 2: amount
    const modifiers = [...data[1].matchAll(/(\+|-)+([\d]*)(?!d)/g)]
    //! Start logic
    const diceAmount = (roll[2] === '') ? 1 : parseInt(roll[2])
    const diceSize = (roll[3] === '') ? 20 : parseInt(roll[3])
    const action = roll?.[4]
    const actionAmount = parseInt(roll?.[5]) ?? 1
    const modifier = (modifiers.length === 0) ? 0 : modifiers.map(mod => mod[0]).reduce((a, b) => a + b)
    if (diceAmount < 1) {
      return ctx.channel.send('No dice to roll')
    }
    //! Roll numbers
    let rolledNumbers = []
    let droppedNumbers = []
    let result = rolledNumbers
    for (let i = 0; i < diceAmount; i++) {
      rolledNumbers.push(Math.floor(randomIntFromInterval(1, diceSize)))
    }
    //! Actions
    if (action === 'kl') { //* Keep lower x
      if (diceAmount <= actionAmount) return ctx.channel.send('All dice were dropped: 0')
      for (let j = 0; j < diceAmount - actionAmount; j++) {
        const max = Math.max(...result)
        const index = result.findIndex(el => el === max)
        droppedNumbers.push(result.splice(index, 1))
      }
    } else if (action === 'kh') { //* Keep highest x
      for (let j = 0; j < diceAmount - actionAmount; j++) {
        const min = Math.min(...result)
        const index = result.findIndex((el) => el === min)
        droppedNumbers.push(result.splice(index, 1))
      }
    } else if (action === 'r') { //* Reroll below x
      if (actionAmount > diceSize) return ctx.channel.send("Can't reroll above dice size")
      result = result.map(x => (x < actionAmount) ? actionAmount : x)
      rolledNumbers = rolledNumbers.map(x => (x < actionAmount) ? actionAmount : x)
    }
    //* No action
    if (!(action === 'kl' || action === 'kh' || action === 'r' || action === undefined)) return ctx.channel.send('Incorrect action specified (kl, kh, r)')
    //! Calculations
    result = (result.length === 1) ? result[0] : result.reduce((a, b) => a + b)
    // eslint-disable-next-line no-eval
    result += eval(modifier)
    //! Messaging
    droppedNumbers = droppedNumbers.map(el => `~~${el}~~`)
    ctx.channel.send(`Rolling ${roll[0] + modifiers.map(mod => mod[0]).join('')}: [${rolledNumbers.concat(droppedNumbers).join(', ')}]: **${result}**`)
    //* End of roll command
  },

  metar: async function (message, args) {
    const params = args.join(' ').slice(6).toUpperCase() // get all params in a nice string
    // reg exps
    const regExp = [
      /[A-Z]{3,4}/,
      /-V/,
      /M|FT/
    ]
    // assign different args to vars
    const ICAO = regExp[0].test(params) ? params.match(regExp[0])[0] : 'KJFK'
    const Verbosity = regExp[1].test(params) ? params.match(regExp[1])[0] : ''
    const Units = regExp[2].test(params) ? params.match(regExp[2])[0] : 'M'
    // prepare request
    const url = `https://avwx.rest/api/metar/${ICAO}?options=info,summary&airport=true&reporting=true&format=json&onfail=cache`
    axios.get(url, {
      headers: {
        Authorization: process.env.METAR_TOKEN
      }
    }).then(res => {
      // print out data as an embed
      const weather = new MessageEmbed()
        .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
        .setTitle(`Weather Info For: ${ICAO}`)
        .setTimestamp(Date.now)
        .addField('Airport Name:', res.data.info.name, false)
        .addField('Current Weather:', res.data.sanitized, false)
      if (Verbosity === '-V') {
        weather.addField('Summary:', res.data.summary, false)
          .addField('City:', res.data.info.city, false)
          .addField('State:', res.data.info.state, false)
          .addField('Country:', res.data.info.country, false)
          .addField('Latitude:', res.data.info.latitude + '°', false)
          .addField('Longitude:', res.data.info.longitude + '°', false)
        if (Units === 'FT') {
          weather.addField('Elevation:', res.data.info.elevation_ft + 'ft', false)
        } else {
          weather.addField('Elevation:', res.data.info.elevation_m + 'm', false)
        }
      }
      weather.setFooter({ text: 'Melvin', icon: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })
      return message.channel.send({ embeds: [weather] })
    }).catch(err => {
      // if response isn't empty show server's response
      if (Object.keys(err).length !== 0) {
        generateError(message.ctx, err.response.data.error)
      } else {
        generateError(message.ctx, `${params} is not a valid ICAO or IATA code`)
      }
    })
  },

  taf: function (message, args) {
    const params = args.join(' ').slice(4).toUpperCase() // get all params in a nice string
    // assign different args to vars
    const ICAO = /[A-Z]{3,4}/.test(params) ? params.match(/[A-Z]{3,4}/)[0] : 'KJFK'
    // prepare request
    const url = `https://avwx.rest/api/taf/${ICAO}?options=info,summary&airport=true&reporting=true&format=json&onfail=cache`
    axios.get(url, {
      headers: {
        Authorization: process.env.METAR_TOKEN
      }
    }).then(res => {
      // print out data as an embed
      const weather = new MessageEmbed()
        .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
        .setTitle(`Weather Forecast For: ${ICAO}`)
        .setTimestamp(Date.now)
        .addField('Airport Name:', res.data.info.name, false)
        .addField('Forecast:', res.data.raw, false)
        .setFooter({ text: 'Melvin', icon: 'https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp' })
      return message.channel.send({ embeds: [weather] })
    }).catch(err => {
      // if response isn't empty show server's response
      if (Object.keys(err).length !== 0) {
        generateError(message.ctx, err.response.data.error)
      } else {
        generateError(message.ctx, `${params} is not a valid ICAO or IATA code`)
      }
    })
  }
}
