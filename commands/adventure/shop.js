const sql = require('sqlite')

const utils = include('utils.js')

const shop = include('commands/adventure/shop.js')
const venture = include('commands/adventure/venture.js')

module.exports.run = async (client, msg, args) => {
  await msg.channel.send('', {
    embed: {
      title: 'SHOP',
      description: 'You stumble upon a shop! :eyes:'
    }
  }).then(async m => {
    const SHOP = utils.emoteCollector(msg, m, ['⚔', '🛡', '🛠', '⬆'], msg.author.id)

    await m.react('⚔')
    await m.react('🛡')
    await m.react('🛠')
    await m.react('⬆')

    SHOP.on('collect', async (messageReaction, reactionCollector) => {
      SHOP.stop()

      await utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))

      const reaction = messageReaction.emoji.name
      const items = include('data/items.js')

      switch (reaction) {
        case '⬆':
          await utils.editEmbed(m, msg, 'Searching for a new area..')
          await venture.run(client, msg, 'no_shop')
          await m.delete(1000)
          break
        case '⚔':
          const weapons = []
          let i = 0
          for (const weapon of items.weapons) {
            i++
            weapons.push(`${i}. Name: ${weapon.name}, Lore: ${weapon.lore}, Cost: ${weapon.value}`)
          }

          sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(async row => {
            const MESSAGE_WEAPONS_DISPLAY = `${weapons.join('\n')}\n\nPick a number from 1 to ${weapons.length}`
            const COLLECTOR_WEAPON = utils.collector(msg)

            await utils.editEmbed(m, msg, `Gold: **${row.gold}**\n\n${MESSAGE_WEAPONS_DISPLAY}`)
            await m.react('⬆') // go back button

            const COLLECTOR_BACK = utils.emoteCollector(msg, m, '⬆', msg.author.id)
            COLLECTOR_BACK.on('collect', async () => {
              COLLECTOR_BACK.stop()
              COLLECTOR_WEAPON.stop()
              await shop.run(client, msg)
              await m.delete()
            })

            COLLECTOR_WEAPON.on('collect', async message => {
              if (isNaN(message)) return
              const chosenWeapon = parseInt(message)
              const weapon_id = chosenWeapon - 1
              const weapon = items.weapons[weapon_id]

              if (row.gold >= weapon.value) {
                // can afford
                await sql.run('UPDATE userprofile set gold = ? WHERE userid = ?', [row.gold -= weapon.value, msg.author.id])
                await sql.run('UPDATE userprofile set righthanditem = ? WHERE userid = ?', [weapon_id + 1, msg.author.id])
                await utils.editEmbed(m, msg, `Gold: **${row.gold}**\n\n${MESSAGE_WEAPONS_DISPLAY}\n\nYou bought a ${weapon.name}`)
              } else {
                // can't afford
                await utils.editEmbed(m, msg, `Gold: **${row.gold}**\n\n${MESSAGE_WEAPONS_DISPLAY}\n\nYou can't afford ${weapon.name}! You need ${weapon.value - row.gold} more gold to purchase this!`)
              }
            })
          })
          break
        case '🛡':
          await utils.editEmbed(m, msg, 'Armor..')
          break
        case '🛠':
          await utils.editEmbed(m, msg, 'Upgrades..')
          break
      }
    })
  })
}

module.exports.help = {
  name: 'shop'
}
