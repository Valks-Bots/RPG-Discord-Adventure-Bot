const sql = require('sqlite')

const utils = include('utils.js')

module.exports.run = async (client, msg, args) => {
  sql.all('SELECT * FROM userprofile').then(row => {
    const leaderboard = []
    for (const prop of row) {
      leaderboard.push({
        name: prop.name,
        health: prop.health,
        gold: prop.gold,
        level: prop.level
      })
    }

    // sort from highest to lowest for defined prop value
    leaderboard.sort((a, b) => b.gold - a.gold)

    // The final message to send to client
    const leaderboard_final = []
    const MAX_DISPLAYED_RESULTS = 10
    if (leaderboard.length >= MAX_DISPLAYED_RESULTS) {
      for (let i = 0; i < MAX_DISPLAYED_RESULTS; i++) {
        leaderboard_final.push(leaderboard[i])
      }
    } else {
      for (let i = 0; i < leaderboard.length; i++) {
        leaderboard_final.push(leaderboard[i])
      }
    }

    const message = []
    for (const prop of leaderboard_final) {
      message.push(`**Name:** \`${prop.name}\`, **Gold:** \`${prop.gold}\`, **Level:** \`${prop.level}\``)
    }

    utils.sendEmbed(msg, message.join('\n'))
  })
}

module.exports.help = {
  name: 'leaderboard'
}
