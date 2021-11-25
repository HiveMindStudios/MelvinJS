// Copyright (c) 2021 Peter Patalong
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
const discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const { Player, RepeatMode } = require("discord-music-player");
require("dotenv").config()

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
});
const player = new Player(client, {
  leaveOnEmpty: false,
  deafenOnJoin: true,
  leaveOnStop: false,
  leaveOnEnd: false
});

client.player = player;

const prefix = process.env.PREFIX

const { ip } = require("./modules/network");
const { qr, dice, roll, metar, taf } = require("./modules/utils");
const { op, bless, askgod, verse, kill, infect, yn, dox, give, kit, uuid, tp, helloworld, randomtp, randomtpall, yeet, randompaintp } = require("./modules/fun");
const { ping, posix, uptime } = require("./modules/meta");
const { play, playlist, skip, stop, loop, volume, seek, queue, shuffle, pause, resume, remove, leave } = require("./modules/music");

client.player
  .on('channelEmpty', (queue) =>
    console.log(`Everyone left the Voice Channel, queue ended.`))

  .on('songAdd', (queue, song) =>
    console.log(`Song ${song} was added to the queue.`))

  .on('playlistAdd', (queue, playlist) =>
    console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))

  .on('queueDestroyed', (queue) =>
    console.log(`The queue was destroyed.`))
 
  .on('queueEnd', (queue) =>
    console.log(`The queue has ended.`))

  .on('songChanged', (queue, newSong, oldSong) =>
    console.log(`${newSong} is now playing.`))

  .on('songFirst', (queue, song) =>
    console.log(`${song} is now playing.`))

  .on('clientDisconnect', (queue) =>
    console.log(`I was kicked from the Voice Channel, queue ended.`))

  .on('clientUndeafen', (queue) =>
    console.log(`I got undefeanded.`))

  .on('error', (error, queue) => {
    console.log(`Error: ${error} in ${queue.guild.name}`);
  });

client.once('ready', () => {
  console.log(`Logged in as: ${client.user.username} - ${client.user.id}`);
  console.log(`Version: ${discord.version}`);
  console.log(`Successfully logged in and booted!`);
});

client.on('ready', () => {
  client.user.setActivity("$help for commands", { type: "STREAMING", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
});

client.once('reconnecting', () => {
  console.log('Reconnecting...');
});

client.once('disconnect', () => {
  console.log('Disconnected');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.trim().split(/ +/g);
  const cmd = args[0].slice(prefix.length).toLowerCase()
  let guildQueue = client.player.getQueue(message.guild.id);

  if (cmd === "ping") {
    ping(message, args)
  }
  else if (cmd === "posix") {
    posix(message, args)
  }
  else if (cmd === "uptime") {
    uptime(message, args)
  }
  else if (cmd === "qr") {
    qr(message, args)
  }
  else if (cmd === "roll") {
    roll(message, args)
  }
  else if (cmd === "metar") {
    metar(message, args)
  }
  else if (cmd === "taf") {
    taf(message, args)
  }
  else if (cmd === "dice") {
    dice(message, args)
  }
  else if (cmd === "ip") {
    ip(message, args)
  }
  else if (cmd === "op") {
    op(message, args)
  }
  else if (cmd === "bless") {
    bless(message, args)
  }
  else if (cmd === "askgod") {
    askgod(message, args)
  }
  else if (cmd === "verse") {
    verse(message, args)
  }
  else if (cmd === "kill") {
    kill(message, args)
  }
  else if (cmd === "infect") {
    infect(message, args)
  }
  else if (cmd === "yn") {
    yn(message, args)
  }
  else if (cmd === "dox") {
    dox(message, args)
  }
  else if (cmd === "give") {
    give(message, args)
  }
  else if (cmd === "kit") {
    kit(message, args)
  }
  else if (cmd === "uuid") {
    uuid(message, args)
  }
  else if (cmd === "tp") {
    tp(message, args)
  }
  else if (cmd === "helloworld") {
    helloworld(message, args)
  }
  else if (cmd === "randomtp") {
    randomtp(message, args)
  }
  else if (cmd === "randomtpall") {
    randomtpall(message, args)
  }
  else if (cmd === "yeet") {
    yeet(message, args)
  }
  else if (cmd === "randompaintp") {
    randompaintp(message, args)
  }
  else if (cmd === "play" || cmd === "p") {
    play(guildQueue, client.player, message, args)
  }
  else if (cmd === "playlist") {
    playlist(guildQueue, client.player, message, args)
  }
  else if (cmd === 'skip') {
    skip(guildQueue, message, args)
  }
  else if (cmd === 'stop') {
    stop(guildQueue, message, args)
  }
  else if (cmd === 'loop') {
    loop(guildQueue, message, args)
  }
  else if (cmd === 'volume' || cmd === 'vol') {
    volume(guildQueue, message, args)
  }
  else if (cmd === 'seek') {
    seek(guildQueue, message, args)
  }
  else if (cmd === 'queue') {
    queue(guildQueue, message, args)
  }
  else if (cmd === 'shuffle') {
    shuffle(guildQueue, message, args)
  }
  else if (cmd === 'pause') {
    pause(guildQueue, message, args)
  }
  else if (cmd === 'resume') {
    resume(guildQueue, message, args)
  }
  else if (cmd === 'remove') {
    remove(guildQueue, message, args)
  }
  else if (cmd === 'leave') {
    leave(guildQueue, message, args)
  }
  else {
    return message.channel.send(`Select correct command ${message.author}!`)
  }
})

client.login(process.env.CLIENT_TOKEN);