const fs = require('fs')

const dir = '../tmp/'

module.exports.adventureCreate = (vUserID, vEnemiesInArea) => {
  const player = {
    userID: vUserID,
    enemiesInArea: vEnemiesInArea,
    enemiesDefeated: 0
  }

  const data = JSON.stringify(player, null, 2)
  fs.writeFileSync(`${dir}/${vUserID}.json`, data)

  // let enemies_defeated_userid = [];
  // let enemies_defeated = [];
  // let enemies_defeated_enemies = [];
}

module.exports.defeatEnemy = (vUserID) => {
  const player = JSON.parse(fs.readFileSync(`${dir}/${vUserID}.json`, 'utf8'))

  player.enemiesDefeated = player.enemiesDefeated + 1

  const data = JSON.stringify(player, null, 2)
  fs.writeFileSync(`${dir}/${vUserID}.json`, data)
}

module.exports.killCount = (vUserID) => {
  const player = JSON.parse(fs.readFileSync(`${dir}/${vUserID}.json`, 'utf8'))

  return player.enemiesDefeated
}

module.exports.enemiesInArea = (vUserID) => {
  const player = JSON.parse(fs.readFileSync(`${dir}/${vUserID}.json`, 'utf8'))

  return player.enemiesInArea
}

module.exports.adventureDestroy = async (vUserID) => {
  fs.unlink(`${dir}/${$vUserID}.json`, (err) => {
    if (err) throw err
  })
}
