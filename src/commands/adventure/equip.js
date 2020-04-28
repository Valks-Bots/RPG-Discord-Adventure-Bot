const sql = require('sqlite')

const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')
const items = include('data/items.js')

module.exports.run = async (client, msg, args) => {
  let item_count
  sql.all('SELECT * FROM inventory WHERE userid = ?', [msg.author.id]).then(row => {
    const inventory = []
    for (const item of row) {
      inventory.push(`Name: ${item.type}, Damage: ${item.damage}`)
    }
    item_count = inventory.length
    if (item_count < 1) return msg.channel.send(messages.leveling.NO_ITEM)

    utils.sendEmbed(msg, `${inventory.join('\n')}\n\nWhat do you want to equip? Pick a number from 1 to ${item_count}.`).then(async m => {
      const TEXT_COLLECTOR = utils.collector(msg)
      TEXT_COLLECTOR.on('collect', async message => {
        if (isNaN(message)) return
        if (message < 1 || message > item_count) return
        TEXT_COLLECTOR.stop()
        await utils.editEmbed(m, msg, 'Pick a slot to equip this item in..')
        const PICKED_ITEM_NUM = parseInt(message) - 1
        const ITEM = row[PICKED_ITEM_NUM]
        const REACTION_COLLECTOR = utils.emoteCollector(msg, m, ['⛑', '👕', '👖', '👞', '🤛', '🤜'], msg.author.id)
        REACTION_COLLECTOR.on('collect', async (messageReaction, reactionCollector) => {
          REACTION_COLLECTOR.stop()
          const reaction = messageReaction.emoji.name
          let slot
          switch (reaction) {
            case '⛑':
              slot = 'helmet'
              break
            case '👕':
              slot = 'chestplate'
              break
            case '👖':
              slot = 'leggings'
              break
            case '👞':
              slot = 'boots'
              break
            case '🤛':
              slot = 'lefthanditem'
              break
            case '🤜':
              slot = 'righthanditem'
              break
          }
          await utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
          await utils.editEmbed(m, msg, `Okay, equipping item in ${slot}`)
          await sql.run('UPDATE inventory SET equipSlot = ? WHERE itemid = ?', [slot, ITEM.itemid]).then(async () => {
            for (const item of row) {
              if (item.equipSlot === slot) {
                await sql.run('UPDATE inventory SET equipSlot = ? WHERE itemid = ?', ['none', item.itemid])
                console.log('removed dupe slot')
              }
            }
          })
        })
        await m.react('⛑')
        await m.react('👕')
        await m.react('👖')
        await m.react('👞')
        await m.react('🤛')
        await m.react('🤜')
      })
    })
  })
}

module.exports.help = {
  name: 'equip'
}
