const botsettings = include('config.json')

const messages = include('data/messages.json')

module.exports.run = async (client, msg, args) => {
  msg.channel.send(messages.action.PRIVATE_DM)
  msg.author.send(`https://discordapp.com/api/oauth2/authorize?client_id=${botsettings.clientID}&permissions=26720&scope=bot`)
}

module.exports.help = {
  name: 'invite'
}
