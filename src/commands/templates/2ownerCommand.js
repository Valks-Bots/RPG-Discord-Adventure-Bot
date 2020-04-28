// utils
const botsettings = include('config.json')
const utils = include('utils.js')
const messages = include('utils/messages.json')
const emotes = include('utils/emojiCharacters.js')

module.exports.run = async (client, msg, args) => {
  if (msg.author.id != botsettings.owner) {
    return msg.reply('You are not the bot owner.')
  }

  // command code
}

module.exports.help = {
  name: 'ping'
}
