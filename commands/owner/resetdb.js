const sql = require('sqlite')
const fs = require('fs')

const botsettings = include('config.json')
const utils = include('utils.js')

module.exports.run = async (client, msg, args) => {
  if (msg.author.id != botsettings.owner) {
    return msg.reply('You are not the bot owner.')
  }

  await sql.close()
  await fs.unlink('database.sqlite', async (err) => {
    if (err) throw err
    console.log('database.sqlite was deleted')
    msg.channel.send('database.sqlite was deleted')
  })
}

module.exports.help = {
  name: 'resetdb'
}
