const botsettings = include('config.json')
const utils = include('utils.js')

module.exports.run = async (client, msg, args) => {
  if (msg.author.id != botsettings.owner) {
    return msg.reply('You are not the bot owner.')
  }
  // const args = utils.getArgs(msg, 1);
  const id = utils.validID(client, msg, args[0])
  console.log(id)
}

module.exports.help = {
  name: 'test2'
}
