const utils = include('utils.js')

const messages = include('data/messages.json')

module.exports.run = async (client, msg, args) => {
  if (!utils.hasPermBoth(msg, 'MUTE_MEMBERS')) return utils.sendEmbed(msg, messages.permissions.MUTE_MEMBERS)
  const user = utils.getUser(msg)
  if (!utils.validID(client, msg, user)) return
  const muted_user = client.users.get(utils.validID(client, msg, user))
  if (muted_user.mute) {
    await muted_user.setMute(false)
    utils.sendEmbed(msg, `Unmuted ${muted_user.username}`)
  } else {
    await muted_user.setMute(true)
    utils.sendEmbed(msg, `Muted ${muted_user.username}`)
  }
}

module.exports.help = {
  name: 'mute'
}
