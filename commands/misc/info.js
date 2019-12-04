const botsettings = include('config.json')

module.exports.run = async (client, msg, args) => {
  return msg.channel.send('', {
    embed: {
      fields: [{
        name: 'Library',
        value: 'discord.js',
        inline: true
      },
      {
        name: 'Guilds',
        value: client.guilds.size,
        inline: true
      },
      {
        name: 'Owner',
        value: client.users.get(botsettings.owner).tag,
        inline: true
      }
      ]
    }
  })
}

module.exports.help = {
  name: 'info'
}
