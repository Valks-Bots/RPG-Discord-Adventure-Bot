const sql = require('sqlite')

const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')
const items = include('data/items.js')

module.exports.run = (client, msg, args) => {
  return utils.sendEmbed(msg, messages.restrictions.DEVELOPMENT)

  const user = utils.getUser(msg, 1)
  if (user == undefined) return utils.sendEmbed(msg, messages.invalid.SPECIFY_USER)

  if (!utils.validID(client, msg, user)) {
    return
  }

  const id = utils.validID(client, msg, user)

  if (id === msg.author.id) return utils.sendEmbed(msg, messages.invalid.SELF)
  if (client.users.get(id).bot) return utils.sendEmbed(msg, messages.invalid.BOT)

  utils.insertUserIntoDatabase(id)

  const invited = '<@' + id + '>'
  utils.sendEmbed(msg, invited + ', do you want to battle ' + msg.author.username).then(m => {
    const filter_accept = (reaction, user) => {
      return reaction.emoji.name === '✅' && user.id === id
    }
    const collector_accept = m.createReactionCollector(filter_accept)

    const filter_deny = (reaction, user) => {
      return reaction.emoji.name === '✖' && user.id === id
    }
    const collector_deny = m.createReactionCollector(filter_deny)

    m.react('✅').then(messageReaction => {
      messageReaction.message.react('✖')
    })

    collector_accept.on('collect', (reaction, reactionCollector) => {
      collector_accept.stop()
      collector_deny.stop()

      utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))

      utils.editEmbed(m, msg, `You are going to battle ${msg.author.username}!`).then(m => {
        sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(attacker => {
          sql.get('SELECT * FROM userprofile WHERE userid = ?', [id]).then(defender => {
            let attacker_health = attacker.health
            let attacker_damage
            let attacker_critical = attacker.critical
            const attacker_name = attacker.name

            let defender_health = defender.health
            let defender_damage
            let defender_critical = defender.critical
            const defender_name = defender.name

            const attacker_action = ''

            const defender_action = ''

            if (attacker.righthanditem === -1) { // The player is using their bare hands.
              attacker_damage = 1
            } else { // Translate the item.
              for (const sitem of items) {
                if (sitem.id === attacker.righthanditem) {
                  attacker_damage = sitem.damage
                  attacker_critical = sitem.critical
                }
              }
            }

            if (defender.righthanditem === -1) { // The player is using their bare hands.
              defender_damage = 1
            } else { // Translate the item.
              for (const sitem of items) {
                if (sitem.id === defender.righthanditem) {
                  defender_damage = sitem.damage
                  defender_critical = sitem.critical
                }
              }
            }

            const attacker_value = (attacker_health + attacker_damage) / 2
            const defender_value = (defender_health + defender_damage) / 2

            const attacker_attack_filter = (reaction, user) => {
              return reaction.emoji.name === '⚔' && user.id === msg.author.id
            }
            const attacker_attack_collector = m.createReactionCollector(attacker_attack_filter)

            const attacker_retreat_filter = (reaction, user) => {
              return reaction.emoji.name === '🏳' && user.id === msg.author.id
            }
            const attacker_retreat_collector = m.createReactionCollector(attacker_retreat_filter)

            //

            const defender_attack_filter = (reaction, user) => {
              return reaction.emoji.name === '⚔' && user.id === id
            }
            const defender_attack_collector = m.createReactionCollector(defender_attack_filter)

            const defender_retreat_filter = (reaction, user) => {
              return reaction.emoji.name === '🏳' && user.id === id
            }
            const defender_retreat_collector = m.createReactionCollector(defender_retreat_filter)

            //

            m.react('⚔').then(messageReaction => {
              messageReaction.message.react('🏳')
            })

            attacker_attack_collector.on('collect', (reaction, reactionCollector) => { // ATTACK
              defender_health -= attacker_damage

              // THIS NEEDS TO BE FIXED
              utils.battleMessage(m, msg, attacker_action, defender_action, attacker_name, defender_name, attacker_health, defender_health, attacker_damage, defender_damage)
              if (defender_health <= 0) {
                attacker_attack_collector.stop()
                attacker_retreat_collector.stop()
                defender_attack_collector.stop()
                defender_retreat_collector.stop()
                defender_health = 0
                // attacker wins
                utils.editEmbed(m, msg, `${attacker_name} beat ${defender_name}`)
                utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES')).then(() => {
                  m.react('☠')
                  const attacker_loot_filter = (reaction, user) => {
                    return reaction.emoji.name === '☠' && user.id === msg.author.id
                  }
                  const attacker_loot_collector = m.createReactionCollector(attacker_loot_filter)
                  attacker_loot_collector.on('collect', (reaction, reactionCollector) => {
                    attacker_loot_collector.stop()
                    utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
                    const coins = Math.floor((Math.random() * defender_value) + 1)
                    sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(row => {
                      utils.editEmbed(m, msg, `You find ${coins} gold coins on the corpse. You now have ${row.gold + parseInt(coins)} gold coins and gained ${defender_value.toFixed(2)} experience, you now have ${(row.exp + defender_value).toFixed(2)} experience.`)
                      sql.run('UPDATE userprofile SET gold = ? WHERE userid = ?', [row.gold + parseInt(coins), msg.author.id])
                    })
                  })
                })
              }
            })

            attacker_retreat_collector.on('collect', (reaction, reactionCollector) => { // RETREAT
              utils.editEmbed(msg, m, `${attacker_name} retreated!`)
              attacker_attack_collector.stop()
              attacker_retreat_collector.stop()
              defender_attack_collector.stop()
              defender_retreat_collector.stop()
              utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
              // THIS NEEDS TO BE FIXED
              utils.battleMessage(m, msg, attacker_action, defender_action, attacker_name, defender_name, attacker_health, defender_health, attacker_damage, defender_damage)
            })

            defender_attack_collector.on('collect', (reaction, reactionCollector) => { // ATTACK
              attacker_health -= defender_damage
              // THIS NEEDS TO BE FIXED
              utils.battleMessage(m, msg, attacker_action, defender_action, attacker_name, defender_name, attacker_health, defender_health, attacker_damage, defender_damage)
              if (attacker_health <= 0) {
                attacker_attack_collector.stop()
                attacker_retreat_collector.stop()
                defender_attack_collector.stop()
                defender_retreat_collector.stop()
                attacker_health = 0
                // defender wins
                utils.editEmbed(m, msg, `${defender_name} beat ${attacker_name}`)
                utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES')).then(() => {
                  m.react('☠')
                  const defender_loot_filter = (reaction, user) => {
                    return reaction.emoji.name === '☠' && user.id === id
                  }
                  const defender_loot_collector = m.createReactionCollector(defender_loot_filter)
                  defender_loot_collector.on('collect', (reaction, reactionCollector) => {
                    defender_loot_collector.stop()
                    utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
                    const coins = Math.floor((Math.random() * attacker_value) + 1)
                    sql.get('SELECT * FROM userprofile WHERE userid = ?', [id]).then(row => {
                      utils.editEmbed(m, msg, `You find ${coins} gold coins on the corpse. You now have ${row.gold + parseInt(coins)} gold coins and gained ${attacker_value.toFixed(2)} experience, you now have ${(row.exp + attacker_value).toFixed(2)} experience.`)
                      sql.run('UPDATE userprofile SET gold = ? WHERE userid = ?', [row.gold + parseInt(coins), msg.author.id])
                    })
                  })
                })
              }
            })

            defender_retreat_collector.on('collect', (reaction, reactionCollector) => { // RETREAT
              utils.editEmbed(msg, m, `${defender_name} retreated!`)
              attacker_attack_collector.stop()
              attacker_retreat_collector.stop()
              defender_attack_collector.stop()
              defender_retreat_collector.stop()
              utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
              // THIS NEEDS TO BE FIXED
              utils.battleMessage(m, msg, attacker_action, defender_action, attacker_name, defender_name, attacker_health, defender_health, attacker_damage, defender_damage)
            })
            // THIS NEEDS TO BE FIXED
            utils.battleMessage(m, msg, attacker_action, defender_action, attacker_name, defender_name, attacker_health, defender_health, attacker_damage, defender_damage)
          })
        })
      })
    })

    collector_deny.on('collect', (reaction, reactionCollector) => {
      collector_accept.stop()
      collector_deny.stop()
      msg.channel.send(`You have denied the offer to battle ${msg.author.username}.`)
      utils.removeAllReactions(msg, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
    })
  })
}

module.exports.help = {
  name: 'battle_human'
}
