const sql = require('sqlite')

const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')
const items = include('data/items.js')

const Weapon = include('classes/weapon.js')

module.exports.run = (client, msg, args) => {
  const randomType = utils.random(items.types)
  const weapon = new Weapon(randomType)

  utils.sendEmbed(msg, `You found a ${weapon.name}!\n\nDamage: ${weapon.damage}, Value: ${weapon.value}, Accuracy: ${weapon.accuracy}, Critical: ${weapon.critical}`)
  sql.run('INSERT INTO inventory (userid, equipSlot, type, damage, value, accuracy, critical) VALUES (?, ?, ?, ?, ?, ?, ?)', [msg.author.id, 'none', weapon.name, weapon.damage, weapon.value, weapon.accuracy, weapon.critical])
}

module.exports.help = {
  name: 'loot'
}
