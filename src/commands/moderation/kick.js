const utils = include('utils.js')

const messages = include('data/messages.json')

module.exports.run = async (client, msg, args) => {
  if (!utils.hasPermBoth(msg, 'KICK_MEMBERS')) return utils.sendEmbed(msg, messages.permissions.KICK_MEMBERS)
  const user = utils.getUser(msg)
  if (!utils.validID(client, msg, user)) return
  const kicked_user = client.users.get(utils.validID(client, msg, user))
  await kicked_user.kick()
  utils.sendEmbed(msg, `Kicked ${kicked_user.username}`)
}

module.exports.help = {
  name: 'kick'
}
