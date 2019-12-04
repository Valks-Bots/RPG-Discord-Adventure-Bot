const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')

module.exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
    return utils.sendEmbed(msg, messages.permissions.MANAGE_MESSAGES)
  }

  if (args[0] == undefined) {
    return utils.sendEmbed(msg, messages.invalid.MESSAGE_COUNT)
  }

  if (!isNaN(args[0])) {
    if (args[0] > 100) {
      return utils.sendEmbed(msg, messages.invalid.LIMIT)
    }
    try {
      msg.channel.bulkDelete(args[0]).then(messages => {
        utils.sendEmbed(msg, `Cleaned up ${messages.size} messages.`)
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (args[0] === 'all') {
    let count = 0
    var completed = false

    while (completed == false) {
      const messages = await msg.channel.fetchMessages({
        limit: 100
      })
      const messagesArr = messages.array()
      const messageCount = messagesArr.length

      // console.log(messageCount);

      for (let i = 0; i < messageCount; i++) {
        await messagesArr[i].delete()
        count = count + 1
      }

      // console.log('check for more messages');
      const check = await msg.channel.fetchMessages({
        limit: 5
      })
      const checkArr = check.array()
      const checkCount = checkArr.length

      // console.log(`Check: ` + checkCount);
      if (checkCount == 0) {
        completed = true
      }
      // console.log(completed);
      msg.channel.send('Purged ' + count + ' messages.')
    }
  }
}

module.exports.help = {
  name: 'purge'
}
