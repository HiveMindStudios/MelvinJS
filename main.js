// Copyright (c) 2021 Peter Patalong
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
const discord = require("discord.js");
const { Client, Intents, MessageEmbed } = require("discord.js");
require("dotenv").config()
const client = new Client({
  intents: [Intents.FLAGS.GUILDS,
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
const prefix = process.env.PREFIX

const { ip } = require("./modules/netTools");
const { qr, dice, roll, metar, taf } = require("./modules/utils");
const { op, bless, askgod, verse, kill, infect, yn, dox, give, kit, uuid, tp, helloworld, randomtp, randomtpall, yeet, randompaintp } = require("./modules/fun");

client.once('ready', () => {
  console.log(`Logged in as: ${client.user.username} - ${client.user.id}`);
  console.log(`Version: ${discord.version}`);
  console.log(`Successfully logged in and booted!`);

  client.user.setStatus('online');
  client.user.setPresence({
    game: {
      name: '$help for commands!',
      type: 'Streaming',
      url: 'https://github.com/VectorKappa/Melvin'
    }
  });
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.trim().split(/ +/g);
  const cmd = args[0].slice(prefix.length).toLowerCase()
  if (cmd === "ping") {
    ping(message, message.author)
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
  else if (cmd == "verse") {
    verse(message, args)
  }
  else if (cmd == "kill") {
    kill(message, args)
  }
  else if (cmd == "infect") {
    infect(message, args)
  }
  else if (cmd == "yn") {
    yn(message, args)
  }
  else if (cmd == "dox") {
    dox(message, args)
  }
  else if (cmd == "give") {
    give(message, args)
  }
  else if (cmd == "kit") {
    kit(message, args)
  }
  else if (cmd == "uuid") {
    uuid(message, args)
  }
  else if (cmd == "tp") {
    tp(message, args)
  }
  else if (cmd == "helloworld") {
    helloworld(message, args)
  }
  else if (cmd == "randomtp") {
    randomtp(message, args)
  }
  else if (cmd == "randomtpall") {
    randomtpall(message, args)
  }
  else if (cmd == "yeet") {
    yeet(message, args)
  }
  else if (cmd == "randompaintp") {
    randompaintp(message, args)
  }
  else {
    return message.channel.send(`Select correct command ${message.author}!`)
  }
})


async function ping(ctx, author) {
  return ctx.channel.send(`Pong ${author}!`)
}

client.login(process.env.CLIENT_TOKEN);