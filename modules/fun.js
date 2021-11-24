const { default: axios } = require("axios");
const { randomIntFromInterval, generateError, sleep } = require("./tools");

module.exports = {
  op: async function (ctx, user) {
    ctx.channel.send(`${user[1]} was given Administrator rights`);
  },

  bless: async function (ctx, user) {
    ctx.channel.send(`${ctx.author} blessed ${user[1]}. What a good person.`);
  },

  askgod: async function (ctx) {
    ctx.channel.send([
      "You probably don't want to know.",
      "Certainly, maybe?",
      "I can't predict it right now",
      "Why should I tell you?",
    ][Math.floor(Math.random() * (3 - 0) + 0)]);
  },

  verse: async function (ctx, args) {
    args.shift()
    var verse = args.join(" ");
    const url_bible = `https://bible-api.com/${verse}`;
    axios.get(url_bible).then(res => {
      if (res.data.text.length < 2000) {
        ctx.channel.send(res.data.text)
      }
      else {
        ctx.channel.send("Quote too long")
      }
    }).catch(err => {
      ctx.channel.send("Not found")
    })
  },

  kill: async function (ctx, user) {
    ctx.channel.send(`${ctx.author} killed ${user[1]}`)
  },

  infect: async function (ctx, user) {
    ctx.channel.send(`${ctx.author} infected ${user[1]} with Covid-19`)
  },

  yn: async function (ctx) {
    ctx.channel.send(["Yes.", "No."][Math.round(Math.random())])
  },

  dox: async function (ctx, user) {
    if (typeof user[1] === "undefined") user[1] = ctx.author;
    ctx.channel.send(`${user[1]}'s IP address is ${Math.floor(Math.random() * (255 - 1) + 1)}.${Math.floor(Math.random() * (255 - 1) + 1)}.${Math.floor(Math.random() * (255 - 1) + 1)}.${Math.floor(Math.random() * (255 - 1) + 1)}`)
  },

  give: async function (ctx, args) {
    if (typeof args[1] === "undefined") args[1] = ctx.author;
    let user = args[1];
    args.shift();
    args.shift();

    let amount = args.join(" ").match(/\d/g).join("");
    let item = args.join(" ").match(/\w\D{1,}/).join("");

    ctx.channel.send(`${ctx.author} gave ${amount} ${item} to ${user}`)
  },

  kit: async function (ctx, args) {
    args.shift();
    let type = args.join(" ");
    ctx.channel.send(`${ctx.author} recievied a ${type} kit!`)
  },

  uuid: async function (ctx, user) {
    if (typeof user[1] === "undefined") {
      ctx.channel.send(`${ctx.author}'s uuid is ${ctx.author.id}`)
    }
    else {
      let uuid = user[1].replace('<@!', '').replace('>', '');
      ctx.channel.send(`${user[1]}'s uuid is ${uuid}`)
    }
  },

  helloworld: async function (ctx) {
    let secret = Math.floor(Math.random() * (100 - 1) + 1);
    if (secret === 69) {
      ctx.channel.send("Shit Happens.")
    }
    else if (secret === 37) {
      ctx.channel.send("H3110 W0r1D!")
    }
    else if (secret === 88) {
      ctx.channel.send("Hewwo Wowwd!")
    }
    else {
      ctx.channel.send("Hello World!")
    }
  },

  tp: async function (ctx, args) {
    ctx.guild.members.fetch(ctx.mentions.members.first()).then((res) => {
      res.voice.setChannel(args[2])
      ctx.channel.send(`Teleported ${args[1]}`)
    }).catch(err => {
      ctx.channel.send("Invalid Syntax. Please try again!")
    })
  },

  randomtp: async function (ctx, user) {
    ctx.guild.channels.fetch().then((channels) => {
      channels = channels.filter(c => c.type === "GUILD_VOICE");
      channelIDs = []
      for (const [channelID, channel] of channels) {
        channelIDs.push(channelID)
        let random = randomIntFromInterval(0, channelIDs.length - 1)  
      }
      ctx.guild.members.fetch(ctx.mentions.members.first())
          .then((res) => {
            res.voice.setChannel(channelIDs[random])
            ctx.channel.send(`Abracadabra ${user[1]}`)
          }).catch(err => {
            ctx.channel.send("Invalid Syntax. Please try again!")
          })
    })
  },
  
  randompaintp: async function (ctx, user) {
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
    ctx.channel.send("Coming Soon!");
  },

  randomtpall: async function (ctx) {
    ctx.guild.channels.fetch().then((channels) => {
      channels = channels.filter(c => c.type === "GUILD_VOICE");
      channelIDs = []
      for (const [channelID, channel] of channels) {
        channelIDs.push(channelID)
        for (const [memberID, member] of channel.members) {
          member.voice.setChannel(channelIDs[randomIntFromInterval(0, channelIDs.length - 1)])
        }
      }
      ctx.channel.send(`Get out of 'ere`);
    }).catch((err) => {
      ctx.channel.send("Invalid Syntax. Please try again!")
    })
  },

  yeet: async function (ctx, user) {
    if (typeof user[1] === "undefined") {
      ctx.guild.members.fetch(ctx.author.id).then((res) => {
        res.voice.setChannel(null)
        ctx.channel.send(`Yeeted ${ctx.author}`)
      }).catch(err => {
        ctx.channel.send("Invalid Syntax. Please try again!")
      })
    }
    else {
      ctx.guild.members.fetch(ctx.mentions.members.first())
        .then((res) => {
          res.voice.setChannel(null)
          ctx.channel.send(`Yeeted ${user[1]}`)
        }).catch(err => {
          ctx.channel.send("Invalid Syntax. Please try again!")
        })
    }
  }

}