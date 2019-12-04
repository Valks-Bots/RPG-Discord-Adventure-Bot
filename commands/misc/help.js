const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')

module.exports.run = async (client, msg, args) => {
  const adventure = [
    'profile <user>',
    'venture',
    'battle_human <user>',
    'clan <invite|info> <user>',
    'leaderboard',
    'equip',
    'loot',
    'setup'
  ]
  const msc = [
    'help',
    'invite',
    'botdiscord',
    'purge <message_count>',
    'info'
  ]
  const moderation = [
    ''
  ]
  const owner = [
    'eval',
    'test'
  ]

  if (msg.guild.me.hasPermission('EMBED_LINKS')) {
    msg.channel.send('', {
      embed: {
        title: 'Help',
        description: `If you're having any problems contact ${client.users.get(botsettings.owner).tag}.`,
        footer: {
          text: messages.fun.BOT_MOTTO
        },
        thumbnail: {
          url: messages.fun.THUMBNAIL_CAT
        },
        fields: [{
          name: 'Adventure',
          value: adventure.join('\n'),
          inline: true
        },
        {
          name: 'Msc',
          value: msc.join('\n'),
          inline: true
        },
        {
          name: 'Owner',
          value: owner.join('\n'),
          inline: true
        }
        ]
      }
    })
  } else {
    msg.channel.send(`**Commands** (prefix ${botsettings.prefix})\`\`\`\n${adventure.join('\n')} ${msc.join('\n')} ${owner.join('\n')}\`\`\`\nI've detected I do not have permissions for EMBED_LINKS, enable this if you want my messages to look a lot nicer.`)
  }
}

module.exports.help = {
  name: 'help'
}
