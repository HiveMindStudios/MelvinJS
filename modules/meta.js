const { format } = require("./tools")

module.exports = {
  ping: async function (ctx) {
    return ctx.channel.send(`Pong! Latency is ${Date.now() - ctx.createdTimestamp}ms.`)
  },

  posix: async function (ctx) {
    ctx.channel.send(`The current POSIX time is: ${Date.now()}ms (from 1/1/1970)`)
  },

  uptime: async function (ctx) {
    ctx.channel.send(`Bot's uptime is: ${format(process.uptime())}`)
  }
}