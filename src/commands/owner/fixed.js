const botsettings = include('config.json')

module.exports.run = async (client, msg, args) => {
  if (msg.author.id != botsettings.owner) {
    return msg.reply('You are not the bot owner.')
  }

  // const args = utils.getArgs(msg, 1);
  const say = args.join(' ')
  client.guilds.get('459849156505108483').channels.get('461529756458942476').send('', {
    embed: {
      description: say,
      thumbnail: {
        url: messages.fun.THUMBNAIL_CAT
      }
    }
  })
}

module.exports.help = {
  name: 'fixed'
}
