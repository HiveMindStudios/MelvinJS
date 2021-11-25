const axios = require("axios").default;
const { randomIntFromInterval, generateError, sleep } = require("./tools.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  qr: async function (message, args) {
    args.shift();
    args = args.join(" ");
    args = encodeURIComponent(args);
    if (typeof args !== "string") return generateError(message, "Please provide data to create QR code!");
    else {
      const qrCode = new MessageEmbed()
        .setColor("#" + Math.floor(Math.random() * 16777215).toString(16))
        .setTitle("Here's your QR code!")
        .setURL(`http://api.qrserver.com/v1/create-qr-code/?data=${args}&size=1000x1000&ecc=Q&margin=8`)
        .setTimestamp(Date.now)
        .setImage(`http://api.qrserver.com/v1/create-qr-code/?data=${args}&size=256x256&ecc=Q&margin=8`)
        .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")
      return message.channel.send({ embeds: [qrCode] })
    }
  },

  dice: async function (message, args) {
    var int = Math.floor(Math.random() * (6 - 1) + 1);
    message.channel.send(int.toString());
  },

  roll: async function (ctx, data) {
    if (typeof data[1] === 'undefined') data[1] = '2d20kl1+3';
    const rolls = [...data[1].matchAll(/(\+|-|\/|\*)?([\d]*)d([\d]*)(kh|kl|r)?([\d])*/g)]
    let modifiers = [...data[1].matchAll(/(\+|-)+([\d]*)(?!d)/g)]
    let toCalc = []
    let modSum = 0
    for (let i = 0; i < modifiers.length; i++) {
      modSum += modifiers[i][0]
    }
    toCalc.push(["", modSum, "", ""])
    for (let i = 0; i < rolls.length; i++) {
      rolls[i][1] === undefined ? rolls[i][1] = '+' : rolls[i][1]
    }
    //! Rolling logic
    try {
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
              droppedDice.push(...rolledDice.splice(rolledDice.indexOf(Math.max(rolledDice)), 1))
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
              droppedDice.push(...rolledDice.splice(rolledDice.indexOf(Math.min(rolledDice)), 1))
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
        if (toCalc[0][1] == 0) toCalc.splice(0, 1)
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
  },

  metar: async function (message, args) {
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
      return message.channel.send({ embeds: [weather] });
    }).catch(err => {
      // if response isn't empty show server's response
      if (Object.keys(err).length !== 0) {
        generateError(ctx, err.response.data.error);
      }
      else {
        generateError(ctx, `${params} is not a valid ICAO or IATA code`);
      }
    });
  },

  taf: function (message, args) {
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
      return message.channel.send({ embeds: [weather] });
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
}