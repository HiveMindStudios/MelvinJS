const { MessageEmbed } = require("discord.js");

module.exports = {
  randomIntFromInterval: function (min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  generateError: function (ctx, message) {
    var error = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("An error occured")
      .setTimestamp(Date.now)
      .setDescription(message)
      .setFooter("Melvin", "https://cdn.discordapp.com/avatars/909848404291645520/f1617585331735015c8c800d21e56362.webp")

    return ctx.channel.send({ embeds: [error] });
  },

  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}