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
    //? Available actions: kl(Keep lower), kh (Keep highest), r (Minimum roll)
    if (typeof data[1] === 'undefined') data[1] = '2d20kl1+3';
    //* roll-> 0: full roll(string) 1: sign(string) 2: dice amount 3: dice size 4: action(string) 5: action amount
    const roll = [...data[1].matchAll(/(\+|-|\/|\*)?([\d]*)d([\d]*)(kh|kl|r)?([\d])*/g)][0]
    //* modifiers-> 0: full mod(string) 1: sign(string) 2: amount
    let modifiers = [...data[1].matchAll(/(\+|-)+([\d]*)(?!d)/g)]
    //! Start logic
    let diceAmount = (roll[2]==="")?1:parseInt(roll[2])
    let diceSize = (roll[3]==="")?20:parseInt(roll[3])
    let action = roll?.[4]
    let actionAmount = parseInt(roll?.[5]) ?? 1
    let modifier = (modifiers.length === 0)? 0: modifiers.map(mod=>mod[0]).reduce((a,b)=>a+b)
    if(diceAmount < 1){
      return ctx.channel.send("No dice to roll")
    }
    //! Roll numbers
    let rolledNumbers = []
    let droppedNumbers = []
    let result = rolledNumbers
    for(let i = 0;i < diceAmount ;i++){
      rolledNumbers.push(Math.floor(randomIntFromInterval(1,diceSize)))
    }
    //! Actions
    //* Keep lower x
    if(action === "kl"){
      if(diceAmount <= actionAmount) return ctx.channel.send("All dice were dropped: 0")
      for(let j = 0; j < diceAmount - actionAmount; j++){
        let max = Math.max(...result)
        let index = result.findIndex((el)=>el === max)
        droppedNumbers.push(result.splice(index, 1))
      }
    }
    //* Keep highest x
    else if(action === "kh"){
      for(let j = 0; j < diceAmount - actionAmount; j++){
        let min = Math.min(...result)
        let index = result.findIndex((el)=>el === min)
        droppedNumbers.push(result.splice(index, 1))
      }
    }
    //* Reroll below x
    else if(action === "r"){
      if(actionAmount > diceSize) return ctx.channel.send("Can't reroll above dice size")
      result = result.map(x=>(x<actionAmount)?actionAmount:x)
      rolledNumbers = rolledNumbers.map(x=>(x<actionAmount)?actionAmount:x)
    }
    //* No action
    if(!(action === "kl" || action === "kh" || action === "r" || action === undefined)) return ctx.channel.send("Incorrect action specified (kl, kh, r)")
    //! Calculations
    result = (result.length === 1)?result[0]:result.reduce((a,b)=>a+b)
    result += eval(modifier)
    //! Messaging
    droppedNumbers = droppedNumbers.map(el=>`~~${el}~~`)
    ctx.channel.send(`Rolling ${roll[0]+modifiers.map(mod=>mod[0]).join("")}: [${rolledNumbers.concat(droppedNumbers).join(", ")}]: **${result}**`)
    //* End of roll command
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