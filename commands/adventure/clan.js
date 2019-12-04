const sql = require('sqlite')

const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')

module.exports.run = (client, msg, args) => {
  if (args[0] == undefined) {
    return msg.channel.send(`Usage: ${botsettings.prefix}clan <invite|info>`)
  }

  switch (args[0].toLowerCase()) {
    case 'kick':
      if (args[1] == undefined) return utils.sendEmbed(msg, `Usage: ${botsettings.prefix}clan kick <user>`)
      const user_kick = utils.getUser(msg, 2)
      if (!utils.validID(client, msg, user_kick)) return
      const user_kick_id = utils.validID(client, msg, user_kick)

      sql.all('SELECT * FROM clan WHERE userid = ?', [msg.author.id]).then(row => {
        for (const user of row) {
          if (user.member === user_kick_id) {
            sql.run('DELETE FROM clan WHERE member = ?', [user_kick_id])
            utils.sendEmbed(msg, `Kicked ${client.users.get(user_kick_id).tag} from your clan.`)
          }
        }
      })
      break
    case 'invite':
      const my_user = utils.getUser(msg, 2)
      if (!utils.validID(client, msg, my_user)) return

      const invite_id = utils.validID(client, msg, my_user)

      if (invite_id === msg.author.id) return utils.sendEmbed(msg, messages.invalid.SELF)
      if (client.users.get(invite_id).bot) return utils.sendEmbed(msg, messages.invalid.BOT)

      const invited = '<@' + invite_id + '>'
      utils.sendEmbed(msg, `${invited}, you were invited to ${msg.author.username}\'s clan. ${messages.await.ACCEPT}`).then(m => {
        let responded = false

        const filter_accept = (reaction, user) => {
          return reaction.emoji.name === '✅' && user.id === invite_id
        }
        const collector_accept = m.createReactionCollector(filter_accept)

        const filter_deny = (reaction, user) => {
          return reaction.emoji.name === '✖' && user.id === invite_id
        }
        const collector_deny = m.createReactionCollector(filter_deny)

        m.react('✅').then(messageReaction => {
          messageReaction.message.react('✖')
        })

        collector_accept.on('collect', (reaction, reactionCollector) => {
          responded = true
          collector_accept.stop()
          collector_deny.stop()

          sql.run('INSERT INTO clan (userid, member) VALUES (?, ?)', [msg.author.id, invite_id])
          utils.editEmbed(m, msg, `You have joined ${msg.author.username}'s clan.`)
          utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
        })

        collector_deny.on('collect', (reaction, reactionCollector) => {
          responded = true
          collector_accept.stop()
          collector_deny.stop()
          utils.editEmbed(m, msg, `You have denied the offer to join ${msg.author.username}'s clan.`)
          utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
        })

        collector_accept.on('end', (reaction, reactionCollector) => {
          if (!responded) msg.channel.send(client.users.get(invite_id).username + ' did not respond in time.')
        })
      })
      break
    case 'info':
      let user
      if (args[1] == undefined) {
        user = msg.author.id
      } else {
        user = utils.getUser(msg, 2)
      }

      if (!utils.validID(client, msg, user)) return
      const id = utils.validID(client, msg, user)
      sql.all('SELECT * FROM clan WHERE userid = ?', [id]).then(row => {
        const members = []
        for (const member of row) {
          const memberid = member.member
          members.push(memberid)
        }
        const names = []
        for (const member of members) {
          names.push(client.users.get(member).tag)
        }
        let checkmembers
        if (names.length == 0) {
          checkmembers = 'No members yet!'
        } else {
          checkmembers = names.join('\n')
        }
        msg.channel.send('', {
          embed: {
            fields: [{
              name: 'Owner',
              value: client.users.get(id).tag,
              inline: true
            },
            {
              name: 'Members',
              value: checkmembers,
              inline: true
            }
            ],
            footer: {
              text: 'A very sexy clan.'
            }
          }
        })
      })
    default:
      break
  }
}

module.exports.help = {
  name: 'clan'
}
