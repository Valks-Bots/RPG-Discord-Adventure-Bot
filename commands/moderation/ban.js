const utils = include('utils.js')

const messages = include('data/messages.json')

module.exports.run = async (client, msg, args) => {
  if (!utils.hasPermBoth(msg, 'BAN_MEMBERS')) return utils.sendEmbed(msg, messages.permissions.BAN_MEMBERS)
  const user = utils.getUser(msg)
  if (!utils.validID(client, msg, user)) return
  const id = utils.validID(client, msg, user)
  utils.sendEmbed(msg, 'How many days of messages do you want to delete for the ban?').then(m => {
    const collector = utils.collector(msg)
    collector.on('collect', message => {
      if (!isNaN(message.content)) {
        collector.stop()
        utils.editEmbed(m, msg, `Okay banned user ${client.users.get(id).username} and deleted ${message.content} days worth of messages.`)
        msg.guild.members.get(id).ban({
          options: {
            days: message.content,
            reason: 'poop'
          }
        })
      } else {
        utils.editEmbed(m, msg, messages.invalid.NAN)
      }
    })
  })
}

module.exports.help = {
  name: 'ban'
}
