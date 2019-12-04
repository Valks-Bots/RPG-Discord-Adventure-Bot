const sql = require('sqlite')

const botsettings = include('config.json')
const utils = include('utils.js')
const bot = include('bot.js')

const venture = include('commands/adventure/venture.js')

const items = include('data/items.js')
const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')

const Player = include('classes/player.js')
const Enemy = include('classes/enemy.js')

module.exports.run = async (client, msg, args) => {
  let player
  let enemy

  sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(async (row) => {
    sql.all('SELECT * FROM inventory WHERE userid = ?', [msg.author.id]).then(inventory => {
      player = new Player(row, inventory)
    })

    enemy = new Enemy(row)

    // Enemy discovery
    const enemiesLeft = `Enemies Defeated in Area: \`${bot.enemies_defeated}/${bot.enemies_defeated_enemies}\``
    const question = `You find yourself in front of a ${enemy.name} holding a ${enemy.weapon_name}! Will you confront it?`
    const stats = `Health: \`${enemy.health}\`, ${enemy.weapon_name}: \`${enemy.weapon_damage}\`, Lootchance: \`${Math.floor(enemy.lootchance)}\``
    utils.sendEmbed(msg, `${enemiesLeft}\n\n${question}\n\n${stats}`).then(async (m) => {
      const yes = utils.emoteCollectorYes(msg, m)
      const no = utils.emoteCollectorNo(msg, m)

      utils.reactYesNo(m)

      const manageMessagesPerm = msg.guild.me.hasPermission('MANAGE_MESSAGES')

      no.on('collect', (reaction, reactionMessage) => {
        yes.stop()
        no.stop()
        utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
        utils.editEmbed(m, msg, `You decide not to approach the ${enemy.name}. ${messages.leveling.FIND_OPPONENT}`)
        utils.askToFightAgain(client, msg, m, manageMessagesPerm)
      })

      yes.on('collect', async (reaction, reactionMessage) => {
        yes.stop()
        no.stop()
        utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES')).then(async () => {
          if (Math.random() < enemy.fleechance) {
            utils.editEmbed(m, msg, `The ${enemy.name} manages to get away! ${messages.leveling.FIND_OPPONENT}`)
            utils.askToFightAgain(client, msg, m, manageMessagesPerm)
            return
          }

          utils.battleMessage(m, msg, '', '', player, enemy)

          const COLLECTOR_ATTACK = utils.emoteCollector(msg, m, '⚔', msg.author.id)
          const COLLECTOR_RUN_AWAY = utils.emoteCollector(msg, m, '🏳', msg.author.id)

          await m.react('⚔')
          await m.react('🏳')

          COLLECTOR_RUN_AWAY.on('collect', (reaction, reactionCollector) => {
            COLLECTOR_ATTACK.stop()
            COLLECTOR_RUN_AWAY.stop()
            utils.editEmbed(m, msg, `You successfully get away from ${enemy.name}! ${messages.leveling.FIND_OPPONENT}`)
            utils.askToFightAgain(client, msg, m, manageMessagesPerm)
          })

          // Collect!
          COLLECTOR_ATTACK.on('collect', async (reaction, reactionCollector) => {
            let battle_stats = ''
            let player_action = ''
            let enemy_action = ''

            const player_damage_modified = parseFloat(player.damage - (player.damage / 2) + Math.random(player.damage)).toFixed(2)

            const player_critical_gen = Math.random()

            if (Math.random() < player.accuracy) {
              // attack
              if (player_critical_gen < player.critical) {
                player_action = `You land a **critical** on the ${enemy.name} for **${player_damage_modified * 2.0}** damage!!`
                enemy.health -= (player_damage_modified * 2.0)
              } else {
                player_action = `You attack the ${enemy.name} for **${player_damage_modified}** damage!!`
                enemy.health -= player_damage_modified
              }
            } else {
              // miss
              player_action = `Your ${player.weapons} miss the ${enemy.name}..`
            }

            if (enemy.health < 0) {
              enemy.health = 0
            }

            let enemy_damage = enemy.dynamicDamage(enemy.weapon_damage)

            if (Math.random() < enemy.weapon_accuracy) {
              if (Math.random() < enemy.weapon_critical) {
                enemy_damage *= 2
                player.setHealth(player.health - enemy_damage)
                enemy_action = `The ${enemy.name} lands a critical on you for **${enemy_damage}** damage!!`
              } else {
                player.setHealth(player.health - enemy_damage)
                enemy_action = `The ${enemy.name} attacks back for **${enemy_damage}** damage!!`
              }
            } else {
              enemy_action = `The ${enemy.name} misses!`
            }

            battle_stats = `${enemy.name} vs ${player.name}\n\nHP: **${enemy.health}**, DMG: ${enemy.weapon_damage}           HP: **${player.health}**, DMG: ${player.damage}`

            if (enemy.health <= 0) {
              COLLECTOR_ATTACK.stop()
              COLLECTOR_RUN_AWAY.stop()

              utils.editEmbed(m, msg, `${enemy.name} defeated!`).then(async m => {
                await utils.removeAllReactions(m, manageMessagesPerm)
                await m.react('☠')

                const LOOT = utils.emoteCollector(msg, m, '☠', msg.author.id)

                LOOT.on('collect', async collected => {
                  LOOT.stop()

                  let area_completed = false
                  for (let i = 0; i < bot.enemies_defeated_userid.length; i++) {
                    if (bot.enemies_defeated_userid[i] === msg.author.id) {
                      const index = i
                      bot.enemies_defeated[i] += 1
                      if (bot.enemies_defeated[i] >= bot.enemies_defeated_enemies[i]) {
                        area_completed = true
                        utils.clearEnemies(msg)
                        break
                      } else {
                        area_completed = false
                        break
                      }
                    }
                  }

                  await utils.gainExperience(msg, enemy.value)
                  let extra_hp = (Math.random() * (Math.cbrt(enemy.value) / 2))
                  const coins = Math.floor((Math.random() * enemy.value) + 1)
                  const MESSAGE_LOOT = `You find **${coins}** gold coins on the corpse. You now have ${row.gold + parseInt(coins)} gold coins and gained **${enemy.value}** experience, you now have ${Math.floor(row.exp + enemy.value)} experience. You gain **${extra_hp.toFixed(2)}** max health, now you have ${(row.maxhealth + parseFloat(extra_hp))} max health.`
                  if (Math.random() < enemy.lootchance) {
                    if (area_completed) {
                      await utils.editEmbed(m, msg, MESSAGE_LOOT)
                    } else {
                      await utils.editEmbed(m, msg, `${MESSAGE_LOOT} ${messages.leveling.FIND_OPPONENT}`)
                    }
                    sql.run('UPDATE userprofile SET gold = ? WHERE userid = ?', [row.gold + parseInt(coins), msg.author.id])
                    sql.run('UPDATE userprofile SET maxhealth = ? WHERE userid = ?', [row.maxhealth + parseFloat(extra_hp), msg.author.id])
                    sql.run('UPDATE userprofile SET health = ? WHERE userid = ?', [row.maxhealth + parseFloat(extra_hp), msg.author.id])
                  } else {
                    const MESSAGE_NO_LOOT = `You do not find anything on the corpse! You gained **${enemy.value}** experience, you now have ${Math.floor(row.exp + enemy.value)} experience. You gain **${extra_hp.toFixed(2)}** max health, now you have ${Math.floor(row.maxhealth + parseFloat(extra_hp))} max health.`
                    if (area_completed) {
                      await utils.editEmbed(m, msg, MESSAGE_NO_LOOT)
                    } else {
                      await utils.editEmbed(m, msg, `${MESSAGE_NO_LOOT} ${messages.leveling.FIND_OPPONENT}`)
                    }
                    extra_hp = (Math.random() * (Math.cbrt(enemy.value) / 8))

                    sql.run('UPDATE userprofile SET maxhealth = ? WHERE userid = ?', [row.maxhealth + parseFloat(extra_hp), msg.author.id])
                    sql.run('UPDATE userprofile SET health = ? WHERE userid = ?', [row.maxhealth + parseFloat(extra_hp), msg.author.id])
                  }

                  if (area_completed) {
                    utils.removeAllReactions(m, manageMessagesPerm).then(async () => {
                      await m.react('💀')
                      const COLLECTOR_AREA_COMPLETED = utils.emoteCollector(msg, m, '💀', msg.author.id)
                      COLLECTOR_AREA_COMPLETED.on('collect', async (reaction, reactionCollector) => {
                        COLLECTOR_AREA_COMPLETED.stop()

                        await utils.removeAllReactions(m, manageMessagesPerm)
                        await utils.editEmbed(m, msg, 'You completed the area!')
                        await venture.run(client, msg)
                        await m.delete(2000)
                      })
                    })
                    return // Prevents message overwrites of battle message..
                  } else {
                    await utils.askToFightAgain(client, msg, m, manageMessagesPerm)
                    return // Prevents message overwrites of battle message..
                  }
                  await utils.removeAllReactions(m, manageMessagesPerm)
                })
              })

              return // Prevents message overwrites of battle message..
            }

            if (player.health <= 0) {
              COLLECTOR_ATTACK.stop()
              COLLECTOR_RUN_AWAY.stop()

              await utils.removeAllReactions(m, manageMessagesPerm)
              await utils.editEmbed(m, msg, `The ${enemy.name} slices you into bits! ${player.name} faints! ${messages.leveling.FIND_OPPONENT}`)
              await utils.askToFightAgain(client, msg, m, manageMessagesPerm)
              return
            }

            if (player.health >= 0 || enemy.health >= 0) {
              await utils.battleMessage(m, msg, player_action, enemy_action, player, enemy)
            }
          })
        })
      })
    })
  }).catch(async (err) => {
    await utils.catchSQLError(err, client, msg)
  })
}

module.exports.help = {
  name: 'battle_ai'
}
