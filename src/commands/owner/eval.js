const botsettings = include('config.json')
const utils = include('utils.js')

module.exports.run = async (client, msg, args) => {
  if (msg.author.id != botsettings.owner) {
    return msg.reply('You are not the bot owner.')
  }

  // const args = utils.getArgs(msg, 1);
  try {
    const code = args.join(' ')
    let evaled = eval(code)

    if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled) }

    msg.channel.send(utils.clean(evaled), {
      code: 'xl'
    })
  } catch (err) {
    msg.channel.send(`\`ERROR\` \`\`\`xl\n${utils.clean(err)}\n\`\`\``)
  }
}

module.exports.help = {
  name: 'eval'
}
