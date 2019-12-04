module.exports.run = async (client, msg, args) => {
  const m = await msg.reply('Ping?')
  return m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms.`)
}

module.exports.help = {
  name: 'ping'
}
