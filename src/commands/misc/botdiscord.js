const messages = include('data/messages.json')

module.exports.run = async (client, msg, args) => {
  msg.channel.send(messages.action.PRIVATE_DM)
  msg.author.send('https://discord.gg/yuVCtwt')
}

module.exports.help = {
  name: 'botdiscord'
}
