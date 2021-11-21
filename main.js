// Copyright (c) 2021 Peter Patalong
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
const fs = require("fs");
const discord = require("discord.js");
const { Client, Intents, MessageEmbed } = require("discord.js");
const { env } = require("process");
const axios = require("axios").default;
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
  else {
    return message.channel.send(`Select correct command ${message.author}!`)
  }
})
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateError(ctx, message) {
  var error = new MessageEmbed()
    .setColor("#FF0000")
    .setTitle("An error occured")
    .setTimestamp(Date.now)
    .setDescription(message)
    .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")

  return ctx.channel.send({ embeds: [error] });
}

async function ping(ctx, author) {
  return ctx.channel.send(`Pong ${author}!`)
}

//* 


//* Network Tools

async function ip(ctx, ip) {
  const url_ip = `https://ipinfo.io/${ip[1]}/json`;
  axios.get(url_ip).then(res => {
    const ipInfo = new MessageEmbed()
      .setColor("#" + Math.floor(Math.random() * 16777215).toString(16))
      .setTitle("IP Address Info")
      .setTimestamp(Date.now)
      .addField("Address:", res.data.ip, false)
      .addField("Hostname:", res.data.hostname, false)
      .addField("Location:", `${res.data.city} ${res.data.region} ${res.data.country} (${res.data.loc})`, false)
      .addField("Timezone:", res.data.timezone, false)
      .addField("Organisation / ISP:", res.data.org, false)
      .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")

    return ctx.channel.send({ embeds: [ipInfo] });
  }).catch(err => {
    generateError(ctx, `${ip[1]} is not a valid IP Address`);
  });
}

//* Utils 

async function qr(ctx, data) {
  if (typeof (data[1]) !== "string") return ctx.channel.send(`${ctx.author} Please provide data to create qr from!`)
  else {
    const qrCode = new MessageEmbed()
      .setColor("#" + Math.floor(Math.random() * 16777215).toString(16))
      .setTitle("Here's your QR code!")
      .setURL(`http://api.qrserver.com/v1/create-qr-code/?data=${data[1]}&size=1000x1000&ecc=Q&margin=8`)
      .setTimestamp(Date.now)
      .setImage(`http://api.qrserver.com/v1/create-qr-code/?data=${data[1]}&size=256x256&ecc=Q&margin=8`)
      .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")
    return ctx.channel.send({ embeds: [qrCode] })
  }
}

async function dice(ctx) {
  var int = Math.floor(Math.random() * (6 - 1) + 1);
  console.log(int);
  ctx.channel.send(int.toString());
}

async function roll(ctx, data) {
  const rolls = [...data[1].matchAll(/(\+|-|\/|\*)?([\d]*)d([\d]*)(kh|kl|r)?([\d])*/g)]
  let modifiers = [...data[1].matchAll(/(\+|-)+([\d]*)(?!d)/g)]
  let toCalc = []
  let modSum = 0
  for(let i = 0; i < modifiers.length; i++){
    modSum += modifiers[i][0]
  }
  toCalc.push(["",modSum,"",""])
  for (let i = 0; i < rolls.length; i++) {
    rolls[i][1] === undefined ? rolls[i][1] = '+' : rolls[i][1]
  }
  //! Rolling logic
  try {
    console.log(rolls)
    for (k = 0; k < rolls.length; k++) {
      if (rolls[k][3] !== "") {
        //! Keep highest (drop lowest)
        if (rolls[k][4].toLowerCase() === "kh") {
          let rolledDice = []
          let droppedDice = []
          for (let i = 0; i < rolls[k][2]; i++) {
            rolledDice.push(randomIntFromInterval(1, rolls[k][3]))
          }
          for (let i = 0; i < (rolledDice.length - rolls[k][5]); i++) {
            droppedDice.push(...rolledDice.splice(rolledDice.indexOf(Math.min(rolledDice)), 1))
          }
          toCalc.push([rolls[k][1], rolledDice.reduce((prev, curr) => prev + curr), rolledDice, droppedDice])
        }
        //! Keep lowest (drop highest)
        else if (rolls[k][4].toLowerCase() === "kl") {
          let rolledDice = []
          let droppedDice = []
          for (let i = 0; i < rolls[k][2]; i++) {
            rolledDice.push(randomIntFromInterval(1, rolls[k][3]))
          }
          for (let i = 0; i < (rolledDice.length - rolls[k][5]); i++) {
            droppedDice.push(...rolledDice.splice(rolledDice.indexOf(Math.max(rolledDice)), 1))
          }
          toCalc.push([rolls[k][1], rolledDice.reduce((prev, curr) => prev + curr), rolledDice, droppedDice])
        }
        //! Minimum roll
        else if (rolls[k][4].toLowerCase() === "r") {
          let rolledDice = [];
          for (let i = 0; i < rolls[k][2]; i++) {
            rolledDice.push(randomIntFromInterval(rolls[k][5], rolls[k][2]))
          }
          toCalc.push([rolls[k][1], rolledDice.reduce((prev, curr) => prev + curr), "", ""])
        }
        else {
          throw "The fuck happened this is unreachable code?"
        }
      }
      else {
        let rolledDice = []
        for (let i = 0; i < rolls[0][2]; i++) {
          rolledDice.push(randomIntFromInterval(1, 20))
        }
        toCalc.push(rolls[k][0], rolledDice.reduce((prev, curr) => prev + curr), rolledDice, "")
      }
      //! Calculations begin
      if(toCalc[0][1] == 0) toCalc.splice(0, 1)
      let message = `Rolling: ${data[1]}`
      let mess = ""
      let result = ""
      for (calculations in toCalc) {
        result += toCalc[calculations][0].toString() + toCalc[calculations][1].toString()
        if (toCalc[calculations][2] !== "") {
          mess += "{"
          for (let i = 0; i < toCalc[calculations][2].length; i++) {
            mess += `(${toCalc[calculations][2][i]}) + `
          }
          for (let i = 0; i < toCalc[calculations][3].length; i++) {
            mess += `(~~${toCalc[calculations][3][i]}~~)`
          }
          mess += "} + "
        }
      }
      mess.replace(/\) \+ \}/, ")}")
      return ctx.channel.send(`${mess + modSum}: **${eval(result)}**`)
    }
  }
  catch (e) {
    return ctx.channel.send(e)
  }
}

async function metar(ctx, args) {
  params = args.join(" ").slice(6).toUpperCase(); // get all params in a nice string

  // assign different args to vars
  var ICAO = params.match(/[A-Z]{3,4}/);
  var Verbosity = params.match(/-V/);
  var Units = params.match(/M|FT/);

  // set defaults
  if (ICAO == null) ICAO = "KJFK";
  if (Verbosity == null) Verbosity = "";
  if (Units == null) Units = "M";

  // prepare request
  const url = `https://avwx.rest/api/metar/${ICAO}?options=info,summary&airport=true&reporting=true&format=json&onfail=cache`;
  axios.get(url, {
    headers: {
      'Authorization': process.env.METAR_TOKEN
    }
  }).then(res => {
    // print out data as an embed
    const weather = new MessageEmbed()
      .setColor("#" + Math.floor(Math.random() * 16777215).toString(16))
      .setTitle(`Weather Info For: ${ICAO}`)
      .setTimestamp(Date.now)
      .addField("Airport Name:", res.data.info.name, false)
      .addField("Current Weather:", res.data.sanitized, false)
    if (Verbosity == "-V") {
      weather.addField("Summary:", res.data.summary, false)
        .addField("City:", res.data.info.city, false)
        .addField("State:", res.data.info.state, false)
        .addField("Country:", res.data.info.country, false)
        .addField("Latitude:", res.data.info.latitude + "°", false)
        .addField("Longitude:", res.data.info.longitude + "°", false)
      if (Units == "FT") {
        weather.addField("Elevation:", res.data.info.elevation_ft + "ft", false)
      }
      else {
        weather.addField("Elevation:", res.data.info.elevation_m + "m", false)
      }
    }
    weather.setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")
    return ctx.channel.send({ embeds: [weather] });
  }).catch(err => {
    // if response isn't empty show server's response
    if (Object.keys(err).length !== 0) {
      generateError(ctx, err.response.data.error);
    }
    else {
      generateError(ctx, `${params} is not a valid ICAO or IATA code`);
    }
  });
}

async function taf(ctx, args) {
  params = args.join(" ").slice(4).toUpperCase(); // get all params in a nice string

  // assign different args to vars
  var ICAO = params.match(/[A-Z]{3,4}/);

  // set defaults
  if (ICAO == null) ICAO = "KJFK";

  // prepare request
  const url = `https://avwx.rest/api/taf/${ICAO}?options=info,summary&airport=true&reporting=true&format=json&onfail=cache`;
  axios.get(url, {
    headers: {
      'Authorization': process.env.METAR_TOKEN
    }
  }).then(res => {
    // print out data as an embed
    const weather = new MessageEmbed()
      .setColor("#" + Math.floor(Math.random() * 16777215).toString(16))
      .setTitle(`Weather Forecast For: ${ICAO}`)
      .setTimestamp(Date.now)
      .addField("Airport Name:", res.data.info.name, false)
      .addField("Forecast:", res.data.raw, false)
      .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")
    return ctx.channel.send({ embeds: [weather] });
  }).catch(err => {
    // if response isn't empty show server's response
    if (Object.keys(err).length !== 0) {
      generateError(ctx, err.response.data.error);
    }
    else {
      generateError(ctx, `${params} is not a valid ICAO or IATA code`);
    }
  });
}

client.login(process.env.CLIENT_TOKEN);