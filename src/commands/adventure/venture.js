const botsettings = include('config.json')
const utils = include('utils.js')
const bot = include('bot.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')
const areas = include('data/areas.js')
const death_messages = include('data/death_messages.js')
const items = include('data/items.js')
const locations = include('data/locations.js')
const enemy_modifiers = include('data/enemy_modifiers.js')

const battle_ai = include('commands/adventure/battle_ai.js')

module.exports.run = async (client, msg, args) => {
  const random_location = locations[Math.floor(Math.random() * locations.length)]
  const shop_encounter_chance = Math.random()
  let shop_encounter_rate = 0.1
  if (args != undefined) {
    if (args == 'no_shop') shop_encounter_rate = 0
  }
  if (shop_encounter_chance < shop_encounter_rate) {
    const shop = include('commands/adventure/shop.js')
    shop.run(client, msg)
  } else {
    utils.sendEmbed(msg, `Will you venture into the ${random_location.name}?`).then(async (m) => {
      const yes = utils.emoteCollector(msg, m, '✅', msg.author.id)
      const no = utils.emoteCollector(msg, m, '✖', msg.author.id)
      await utils.reactYesNo(m)

      yes.on('collect', async (reaction, reactionMessage) => {
        yes.stop()
        no.stop()

        await utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
        await utils.editEmbed(m, msg, `Okay, you're entering the ${random_location.name} with ${random_location.enemies} enemies..`)

        bot.enemies_defeated_userid.push(msg.author.id)
        bot.enemies_defeated.push(0)
        bot.enemies_defeated_enemies.push(random_location.enemies)

        await battle_ai.run(client, msg)
        await m.delete(2000)
      })

      no.on('collect', async (reaction, reactionMessage) => {
        yes.stop()
        no.stop()

        await utils.removeAllReactions(m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
        await utils.editEmbed(m, msg, 'Do you want to search for another area?')
        await utils.askToFindNewArea(client, msg, m, msg.guild.me.hasPermission('MANAGE_MESSAGES'))
      })
    })
  }
}

module.exports.help = {
  name: 'venture'
}
