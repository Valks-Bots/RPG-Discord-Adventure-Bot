const botsettings = include('config.json')

module.exports.run = async (client, msg, args) => {
  if (msg.author.id != botsettings.owner) {
    return msg.reply('You are not the bot owner.')
  }

  const servers = []
  for (const guild of client.guilds.values()) {
    if (guild.me.hasPermission('MANAGE_GUILD')) {
      guild.fetchInvites().then(invites => {
        for (const invite of invites.values()) {
          servers.push(invite.url)
          break
        }
        msg.channel.send(servers.join('\n'))
      })
    }
  }
}

module.exports.help = {
  name: 'test'
}
