const sql = require('sqlite');
const Discord = require('discord.js');
const botsettings = include('config.json');
const messages = include('data/messages.json');

module.exports = {
  embed,
  sendEmbed,
  editEmbed,
  removeAllReactions,
  battleMessage,
  insertUserIntoDatabase,
  clean,
  collector,
  emoteCollector,
  gainExperience,
  validID,
  getArgs,
  getUser,
  hasPermBoth,
  hasPermMember,
  hasPermBot,
  emoteCollectorNo,
  emoteCollectorYes,
  askToFightAgain,
  askToFindNewArea,
  reactYesNo,
  quickSort,
  generateDatabase,
  catchSQLError,
  clearEnemies,
  random
}

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function quickSort(array) { //input an array of objects
  let left = [];
  let right = [];
  let pivot = array.pop();
  let length = array.length;

  if (length <= 1) {
    return array;
  } else {
    var newArray = [];
    for (let i = 0; i < length; i++) {
      if (array[i] <= pivot) {
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
    }
  }

  return newArray.concat(quickSort(left), pivot, quickSort(right));
}

async function askToFindNewArea(client, msg, m, manageMessagesPerm) {
  await removeAllReactions(m, manageMessagesPerm);

  const yes = emoteCollectorYes(msg, m);
  const no = emoteCollectorNo(msg, m);

  await reactYesNo(m);

  yes.on('collect', async (reaction, reactionMessage) => {
    let venture = include('commands/adventure/venture.js');

    yes.stop();
    no.stop();

    await removeAllReactions(m, manageMessagesPerm);
    await editEmbed(m, msg, `Searching for a new area..`);
    await venture.run(client, msg);
    await m.delete(2000);
  });

  no.on('collect', async (reaction, reactionMessage) => {
    yes.stop();
    no.stop();

    await removeAllReactions(m, manageMessagesPerm);
    await editEmbed(m, msg, `You decide not to look for another area..`);
    await m.delete(2000);
  });
}

function clearEnemies(msg) {
  let bot = include('bot.js');

  for (let i = 0; i < bot.enemies_defeated_userid.length; i++) {
    if (bot.enemies_defeated_userid[i] === msg.author.id) {
      bot.enemies_defeated_userid.splice(i, 1);
      bot.enemies_defeated_enemies.splice(i, 1);
      bot.enemies_defeated.splice(i, 1);
    }
  }
}

async function askToFightAgain(client, msg, m, manageMessagesPerm) {
  await removeAllReactions(m, manageMessagesPerm);

  const yes = emoteCollectorYes(msg, m);
  const no = emoteCollectorNo(msg, m);

  await reactYesNo(m);

  yes.on('collect', async (reaction, reactionMessage) => {
    let battle_ai = include('commands/adventure/battle_ai.js');

    yes.stop();
    no.stop();

    await removeAllReactions(m, manageMessagesPerm);
    await editEmbed(m, msg, `Searching for another opponent..`);
    await battle_ai.run(client, msg);
    await m.delete(2000);
  });

  no.on('collect', async (reaction, reactionMessage) => {
    yes.stop();
    no.stop();

    clearEnemies(msg);

    await removeAllReactions(m, manageMessagesPerm);
    await editEmbed(m, msg, `You decide not to look for another opponent..`);
    await m.delete(2000);
  });
}

function emoteCollectorYes(msg, m) {
  return emoteCollector(msg, m, '✅', msg.author.id);
}

function emoteCollectorNo(msg, m) {
  return emoteCollector(msg, m, '✖', msg.author.id);
}

function hasPermBoth(msg, perm) {
  if (msg.guild.me.hasPermission(perm.toUpperCase()) && msg.member.hasPermission(perm.toUpperCase())) {
    return true;
  }
}

function hasPermBot(msg, perm) {
  return msg.guild.me.hasPermission(perm.toUpperCase());
}

function hasPermMember(msg, perm) {
  return msg.member.hasPermission(perm.toUpperCase());
}

function getArgs(msg, slice = 1) {
  return msg.content.slice(botsettings.prefix.length).trim().split(/ +/g).slice(slice);
}

function getUser(msg, slice = 1) {
  const args = getArgs(msg, slice);
  return args.join(' ');
}

function validID(client, msg, arguments) {
  let id;
  if (arguments === undefined) return;
  const args = arguments.replace(/[<@>]/g, '');
  if (args === undefined || args === '') {
    sendEmbed(msg, 'Please specify some arguments.');
    return false;
  }
  if (isNaN(args)) { //not a number
    if (!msg.guild.members.find('displayName', args)) {
      sendEmbed(msg, 'That is not a valid user! Remember kids this stuff is case sensitive!');
      return false;
    }
    id = msg.guild.members.find('displayName', args).id;
  } else {
    if (!client.users.get(args)) {
      sendEmbed(msg, 'That is not a valid user!');
      return false;
    }
    id = args;
  }
  return id;
}

function sendEmbed(msg, desc) {
  return msg.channel.send(embed(desc, msg.guild.me.hasPermission('EMBED_LINKS')));
}

function editEmbed(m, msg, desc) {
  return m.edit(embed(desc, msg.guild.me.hasPermission('EMBED_LINKS')));
}

function embed(desc, condition) {
  if (!condition) {
    return desc;
  }
  return ('', {
    embed: {
      description: desc,
      color: 0x36393E
    }
  });
}

function removeAllReactions(m, condition) {
  if (condition) return m.clearReactions();

  if (m.reactions !== undefined) {
    return Promise.all(m.reactions.map((messageReaction) => {
      if (messageReaction.me) {
        messageReaction.remove();
      }
    }));
  } else {
    return new Promise(function(resolve, reject) {
      resolve();
    });
  }
}

function battleMessage(m, msg, player_action, enemy_action, player, enemy) {
  if (msg.guild.me.hasPermission('EMBED_LINKS')) {
    return m.edit('', {
      embed: {
        description: `${player_action} ${enemy_action}`,
        fields: [{
            name: enemy.name,
            value: `HP: **${parseFloat(enemy.health).toFixed(2)}** ${enemy.weapon_name}: ${parseFloat(enemy.weapon_damage).toFixed(2)}`,
            inline: true
          },
          {
            name: player.name,
            value: `HP: **${parseFloat(player.health).toFixed(2)}** ${player.weapons}: ${parseFloat(player.damage).toFixed(2)}`,
            inline: true
          }
        ],
        color: 0x36393E
      }
    });
  } else {
    return m.edit(`${enemy.name}       vs       ${player.name}\n\nHP: **${parseFloat(enemy.health).toFixed(2)}** DMG: ${enemy.weapon_damage.toFixed(2)}         HP: **${player.health.toFixed(2)}** DMG: ${player.damage.toFixed(2)}\n\n${player_action} ${enemy_action}`);
  }
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

function collector(msg) {
  const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {
    time: botsettings.collectionLifetime
  });
  return collector;
}

function reactYesNo(reactionMessage) {
  reactionMessage.react('✅').then(reactionMessage => {
    reactionMessage.message.react('✖');
  })
}

function emoteCollector(msg, reactionMessage, emotes, id) {
  const filter = (reaction, user) => {
    return emotes.includes(reaction.emoji.name) && user.id === id;
  };
  const collector = reactionMessage.createReactionCollector(filter);

  return collector;
}

function insertUserIntoDatabase(user, client, msg) {
  return sql.run('INSERT OR IGNORE INTO userprofile (userid, name, age, gender, health, gold, clan, level, exp, lefthanditem, righthanditem, helmet, chestplate, leggings, boots, maxhealth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [user.id, user.username, 0, 'Did not specify', 10, 10, 'Not in a Clan', 1, 0, -1, -1, -1, -1, -1, -1, 10]);
}

/*
 * Specifically for a SQLITE_MISUSE error to prevent duplication of code.
 * The function must be async or the code will attempt to insert a user into a non-existant database.
 */
async function catchSQLError(err, client, msg) {
  if (err.code === 'SQLITE_MISUSE') {
    await sendEmbed(msg, messages.error.SQLITE_MISUSE);
    await sql.open('./database.sqlite');
    await generateDatabase(client);
    await insertUserIntoDatabase(msg.author, client, msg);
  }
}

async function generateDatabase(client) {
  await sql.run('CREATE TABLE IF NOT EXISTS userprofile (userid TEXT UNIQUE, name CHARACTER, age INTEGER, gender CHARACTER, health INTEGER, gold INTEGER, clan CHARACTER, level INTEGER, exp DOUBLE, lefthanditem INTEGER, righthanditem INTEGER, helmet INTEGER, chestplate INTEGER, leggings INTEGER, boots INTEGER, maxhealth INTEGER)'); //main user table
  await sql.run('CREATE TABLE IF NOT EXISTS settings (guildid TEXT UNIQUE)').then(() => {
    for (const guild of client.guilds.values()) {
      sql.run('INSERT OR IGNORE INTO settings (guildid) VALUES (?)', [guild.id]);
    }
  });
  await sql.run('CREATE TABLE IF NOT EXISTS inventory (itemid INTEGER PRIMARY KEY AUTOINCREMENT, userid TEXT, equipSlot TEXT, type TEXT, damage DOUBLE, value INTEGER, accuracy DOUBLE, critical DOUBLE)');
  await sql.run('CREATE TABLE IF NOT EXISTS clan (userid TEXT, member TEXT)');
}

function gainExperience(msg, expGained) {
  sql.run(`UPDATE userprofile SET exp = exp + ${expGained} WHERE userid = ?`, [msg.author.id]);
  sql.get('SELECT * FROM userprofile WHERE userid = ?', [msg.author.id]).then(row => {
    const curLevel = Math.floor(0.25 * Math.sqrt(row.exp + 1));
    if (curLevel > row.level) {
      row.level = curLevel;
      sql.run('UPDATE userprofile SET level = level + 1 WHERE userid = ?', [msg.author.id]);
    }
  });
}