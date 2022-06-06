const { default: axios } = require('axios')
const { randomIntFromInterval, generateError } = require('./tools')

module.exports = {
  op: async function (message, args) {
    message.channel.send(`${args[1]} was given Administrator rights`)
  },

  bless: async function (message, args) {
    message.channel.send(`${message.author} blessed ${args[1]}. What a good person.`)
  },

  askgod: async function (message, args) {
    message.channel.send([
      "You probably don't want to know.",
      'Certainly, maybe?',
      "I can't predict it right now",
      'Why should I tell you?'
    ][Math.floor(Math.random() * (3 - 0) + 0)])
  },

  verse: async function (message, args) {
    args.shift()
    const verse = args.join(' ')
    const urlBible = `https://bible-api.com/${verse}`
    axios.get(urlBible).then(res => {
      if (res.data.text.length < 2000) {
        message.channel.send(res.data.text)
      } else {
        message.channel.send('Quote too long')
      }
    }).catch(() => {
      message.channel.send('Not found')
    })
  },

  kill: async function (message, args) {
    message.channel.send(`${message.author} killed ${args[1]}`)
  },

  infect: async function (message, args) {
    message.channel.send(`${message.author} infected ${args[1]} with Covid-19`)
  },

  yn: async function (message, args) {
    message.channel.send(['Yes.', 'No.'][Math.round(Math.random())])
  },

  dox: async function (message, args) {
    if (typeof args[1] === 'undefined') args[1] = message.author
    message.channel.send(`${args[1]}'s IP address is ${Math.floor(Math.random() * (255 - 1) + 1)}.${Math.floor(Math.random() * (255 - 1) + 1)}.${Math.floor(Math.random() * (255 - 1) + 1)}.${Math.floor(Math.random() * (255 - 1) + 1)}`)
  },

  give: async function (message, args) {
    if (typeof args[1] === 'undefined') args[1] = message.author
    const user = args[1]
    args.shift()
    args.shift()

    const amount = args.join(' ').match(/\d/g).join('')
    const item = args.join(' ').match(/\w\D{1,}/).join('')

    message.channel.send(`${message.author} gave ${amount} ${item} to ${user}`)
  },

  kit: async function (message, args) {
    args.shift()
    const type = args.join(' ')
    message.channel.send(`${message.author} recievied a ${type} kit!`)
  },

  uuid: async function (message, args) {
    if (typeof args[1] === 'undefined') {
      message.channel.send(`${message.author}'s uuid is ${message.author.id}`)
    } else {
      const uuid = args[1].replace('<@!', '').replace('>', '')
      message.channel.send(`${args[1]}'s uuid is ${uuid}`)
    }
  },

  helloworld: async function (message, args) {
    const secret = Math.floor(Math.random() * (100 - 1) + 1)
    if (secret === 69) {
      message.channel.send('Shit Happens.')
    } else if (secret === 37) {
      message.channel.send('H3110 W0r1D!')
    } else if (secret === 88) {
      message.channel.send('Hewwo Wowwd!')
    } else {
      message.channel.send('Hello World!')
    }
  },

  tp: async function (message, args) {
    message.guild.members.fetch(message.mentions.members.first()).then((res) => {
      res.voice.setChannel(args[2])
      message.channel.send(`Teleported ${args[1]}`)
    }).catch(err => {
      console.log(err)
      generateError('Invalid Syntax. Please try again!')
    })
  },

  randomtp: async function (message, args) {
    message.guild.channels.fetch().then((channels) => {
      channels = channels.filter(c => c.type === 'GUILD_VOICE')
      const channelIDs = []
      for (const [channelID] of channels) {
        channelIDs.push(channelID)
      }
      const random = randomIntFromInterval(0, channelIDs.length - 1)
      message.guild.members.fetch(message.mentions.members.first())
        .then((res) => {
          res.voice.setChannel(channelIDs[random])
          message.channel.send(`Abracadabra ${args[1]}`)
        }).catch(err => {
          console.log(err)
          generateError('Invalid Syntax. Please try again!')
        })
    })
  },

  randompaintp: async function (message, args) {
    // ctx.guild.channels.fetch().then((channels) => {
    //   channels = channels.filter(c => c.type === "GUILD_VOICE");
    //   channelIDs = []
    //   for (const [channelID, channel] of channels) {
    //     channelIDs.push(channelID)
    //     let random = randomIntFromInterval(0, channelIDs.length - 1)

    //     ctx.guild.members.fetch(ctx.mentions.members.first())
    //       .then((res) => {
    //         res.voice.setChannel(channelIDs[random])
    //         ctx.channel.send(`Pain ${user[1]}`)
    //       }).catch(err => {
    //         ctx.channel.send("Invalid Syntax. Please try again!")
    //         return 0;
    //       })
    //       sleep(3000);
    //   }
    // })
    message.channel.send('Coming Soon!')
  },

  randomtpall: async function (message, args) {
    message.guild.channels.fetch().then((channels) => {
      channels = channels.filter(c => c.type === 'GUILD_VOICE')
      const channelIDs = []
      for (const [channelID, channel] of channels) {
        channelIDs.push(channelID)
        for (const [member] of channel.members) {
          member.voice.setChannel(channelIDs[randomIntFromInterval(0, channelIDs.length - 1)])
        }
      }
      message.channel.send("Get out of 'ere")
    }).catch(() => {
      generateError('Invalid Syntax. Please try again!')
    })
  },

  yeet: async function (message, args) {
    if (typeof args[1] === 'undefined') {
      message.guild.members.fetch(message.author.id).then((res) => {
        res.voice.setChannel(null)
        message.channel.send(`Yeeted ${message.author}`)
      }).catch(err => {
        console.log(err)
        generateError('Invalid Syntax. Please try again!')
      })
    } else {
      message.guild.members.fetch(message.mentions.members.first())
        .then((res) => {
          res.voice.setChannel(null)
          message.channel.send(`Yeeted ${args[1]}`)
        }).catch(err => {
          console.log(err)
          generateError('Invalid Syntax. Please try again!')
        })
    }
  }

}
