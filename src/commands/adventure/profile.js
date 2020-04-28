const sql = require('sqlite')

const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')
const items = include('data/items.js')

module.exports.run = (client, msg, args) => {
  // Check someones profile

  // const args = utils.getArgs(msg, 1);
  const user = args.join(' ')
  let id
  if (user == undefined || user == '') {
    id = msg.author.id
  } else {
    if (!utils.validID(client, msg, user)) return
    id = utils.validID(client, msg, user)
  }

  if (client.users.get(id).bot) return utils.sendEmbed(msg, messages.invalid.BOT)

  const equipped = []
  sql.all('SELECT * FROM inventory WHERE userid = ?', [msg.author.id]).then(row => {
    for (const item of row) {
      if (item.equipSlot !== 'none') {
        const slot = item.equipSlot
        const sexify = slot.charAt(0).toUpperCase() + slot.substr(1) // Capitialize the first letter!
        equipped.push(`${sexify}: \`${item.type}\``)
      }
    }

    if (equipped.length == 0) {
      equipped.push('Nothing is equipped..')
    }
  })

  sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(row => {
    const stats = [
      `Health: \`${row.health.toFixed(2)}\` / \`${row.maxhealth.toFixed(2)}\``,
      `Gold: \`${row.gold}\``,
      `Level: \`${row.level}\``,
      `Exp: \`${row.exp.toFixed(2)}\``
    ]
    const bio = [
      `Name: \`${row.name}\``,
      `Age: \`${row.age}\``,
      `Gender: \`${row.gender}\``
    ]
    const equipment = [
      equipped.join('\n')
    ]
    msg.channel.send('', {
      embed: {
        title: `**${client.users.get(id).username.toUpperCase()}**`,
        fields: [{
          name: 'Equipment',
          value: equipment.join('\n'),
          inline: true
        },
        {
          name: 'Bio',
          value: bio.join('\n'),
          inline: true
        },
        {
          name: 'Stats',
          value: stats.join('\n'),
          inline: true
        }
        ]
      }
    }).then(m => {
      const left = utils.emoteCollector(msg, m, '⬅', msg.author.id)
      const right = utils.emoteCollector(msg, m, '➡', msg.author.id)

      left.on('collect', (reaction, reactionCollector) => {
        utils.editEmbed(m, msg, 'Left Page')
      })
      right.on('collect', (reaction, reactionCollector) => {
        utils.editEmbed(m, msg, 'Right Page')
      })
    })
  }).catch(async (err) => {
    await utils.catchSQLError(err, client, msg)
  })
}

module.exports.help = {
  name: 'profile'
}
