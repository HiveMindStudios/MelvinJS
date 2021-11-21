module.exports = {
  ip: async function (ctx, ip) {
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
}