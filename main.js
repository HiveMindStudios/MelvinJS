// Copyright (c) 2022 Peter Patalong, Michael Czyz, Dawid Głąb
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const discord = require('discord.js')
const { Client, Intents } = require('discord.js')
const { Player } = require('discord-music-player')
require('dotenv').config()

const client = new Client({
  intents:
    [Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING]
})
const player = new Player(client, {
  leaveOnEmpty: false,
  deafenOnJoin: true,
  leaveOnStop: false,
  leaveOnEnd: false
})

client.player = player

const prefix = process.env.PREFIX

const network = require('./modules/network')
const utils = require('./modules/utils')
const fun = require('./modules/fun')
const meta = require('./modules/meta')
const music = require('./modules/music')

client.player
  .on('channelEmpty', (queue) =>
    console.log('Everyone left the Voice Channel, queue ended.'))

  .on('songAdd', (queue, song) =>
    console.log(`Song ${song} was added to the queue.`))

  .on('playlistAdd', (queue, playlist) =>
    console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))

  .on('queueDestroyed', (queue) =>
    console.log('The queue was destroyed.'))

  .on('queueEnd', (queue) =>
    console.log('The queue has ended.'))

  .on('songChanged', (queue, newSong, oldSong) =>
    console.log(`${newSong} is now playing.`))

  .on('songFirst', (queue, song) =>
    console.log(`${song} is now playing.`))

  .on('clientDisconnect', (queue) =>
    console.log('I was kicked from the Voice Channel, queue ended.'))

  .on('clientUndeafen', (queue) =>
    console.log('I got undefeanded.'))

  .on('error', (error, queue) => {
    console.log(`Error: ${error} in ${queue.guild.name}`)
  })

client.once('ready', () => {
  console.log(`Logged in as: ${client.user.username} - ${client.user.id}`)
  console.log(`Version: ${discord.version}`)
  console.log('Successfully logged in and booted!')
})

client.on('ready', () => {
  client.user.setActivity('$help for commands', { type: 'STREAMING', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
})

client.once('reconnecting', () => {
  console.log('Reconnecting...')
})

client.once('disconnect', () => {
  console.log('Disconnected')
})

client.on('messageCreate', async message => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  const args = message.content.trim().split(/ +/g)
  const cmd = args[0].slice(prefix.length).toLowerCase()
  const guildQueue = client.player.getQueue(message.guild.id)
  switch (cmd) {
    //* Meta
    case 'help': meta.help(message, args); break
    case 'ping': meta.ping(message, args); break
    case 'posix': meta.posix(message, args); break
    case 'uptime': meta.uptime(message, args); break
    //* Utils
    case 'qr': utils.qr(message, args); break
    case 'roll': utils.roll(message, args); break
    case 'metar': utils.metar(message, args); break
    case 'taf': utils.taf(message, args); break
    case 'dice': utils.dice(message, args); break
    //* Network
    case 'ip': network.ip(message, args); break
    //* Fun
    case 'op': fun.op(message, args); break
    case 'bless': fun.bless(message, args); break
    case 'askgod': fun.askgod(message, args); break
    case 'verse': fun.verse(message, args); break
    case 'kill': fun.kill(message, args); break
    case 'infect': fun.infect(message, args); break
    case 'yn': fun.yn(message, args); break
    case 'dox': fun.dox(message, args); break
    case 'give': fun.give(message, args); break
    case 'kit': fun.kit(message, args); break
    case 'uuid': fun.uuid(message, args); break
    case 'tp': fun.tp(message, args); break
    case 'helloworld': fun.helloworld(message, args); break
    case 'randomtp': fun.randomtp(message, args); break
    case 'randomtpall': fun.randomtpall(message, args); break
    case 'yeet': fun.yeet(message, args); break
    case 'randompaintp': fun.randompaintp(message, args); break
    //* Music
    case 'play':
    case 'p': music.play(guildQueue, client.player, message, args); break
    case 'playlist': music.playlist(guildQueue, client.player, message, args); break
    case 'skip': music.skip(guildQueue, message, args); break
    case 'stop': music.stop(guildQueue, message, args); break
    case 'loop': music.loop(guildQueue, message, args); break
    case 'volume':
    case 'v': music.volume(guildQueue, message, args); break
    case 'seek': music.seek(guildQueue, message, args); break
    case 'queue': music.queue(guildQueue, message, args); break
    case 'shuffle': music.shuffle(guildQueue, message, args); break
    case 'pause': music.pause(guildQueue, message, args); break
    case 'resume': music.resume(guildQueue, message, args); break
    case 'remove': music.remove(guildQueue, message, args); break
    case 'leave': music.leave(guildQueue, message, args); break
    default:
      return message.channel.send(`Select correct command ${message.author}!`)
  }
})

client.login(process.env.CLIENT_TOKEN)
