const sql = require('sqlite')

module.exports.run = (client, msg, args) => {
  sql.run('UPDATE userprofile SET level = 1 WHERE userid = ?', [msg.author.id])
  sql.run('UPDATE userprofile SET exp = 0 WHERE userid = ?', [msg.author.id])
  msg.channel.send('Reset your level!')
}

module.exports.help = {
  name: 'resetlevel'
}
