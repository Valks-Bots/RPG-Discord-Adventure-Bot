const fs = require('fs');

const dir = '../tmp/';

module.exports.adventureCreate = (vUserID, vEnemiesInArea) => {
    let player = {
        userID: vUserID,
        enemiesInArea: vEnemiesInArea,
        enemiesDefeated: 0
    }

    let data = JSON.stringify(player, null, 2);  
    fs.writeFileSync(`${dir}/${vUserID}.json`, data);  


    //let enemies_defeated_userid = [];
    //let enemies_defeated = [];
    //let enemies_defeated_enemies = [];    

}

module.exports.defeatEnemy =  (vUserID) => {
    let player = JSON.parse(fs.readFileSync(`${dir}/${vUserID}.json`, 'utf8'));

    player.enemiesDefeated = player.enemiesDefeated + 1;

    let data = JSON.stringify(player, null, 2);  
    fs.writeFileSync(`${dir}/${vUserID}.json`, data);  

}

module.exports.killCount =  (vUserID) => {
    let player = JSON.parse(fs.readFileSync(`${dir}/${vUserID}.json`, 'utf8'));

    return player.enemiesDefeated;

}

module.exports.enemiesInArea =  (vUserID) => {
    let player = JSON.parse(fs.readFileSync(`${dir}/${vUserID}.json`, 'utf8'));

    return player.enemiesInArea;

}


module.exports.adventureDestroy = async (vUserID) => {
    fs.unlink(`${dir}/${$vUserID}.json`, (err) => {
        if (err) throw err;
      });
}