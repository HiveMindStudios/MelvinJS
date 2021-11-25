const { format } = require("./tools")

module.exports = {
  ping: async function (message, args) {
    return message.channel.send(`Pong! Latency is ${Date.now() - message.createdTimestamp}ms.`)
  },

  posix: async function (message, args) {
    message.channel.send(`The current POSIX time is: ${Date.now()}ms (from 1/1/1970)`)
  },

  uptime: async function (message, args) {
    message.channel.send(`Bot's uptime is: ${format(process.uptime())}`)
  }
}