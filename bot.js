const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require('sqlite');
const fs = require('fs');
const path = require('path');

// connect to database
sql.open('./database.sqlite');

require('dotenv').config()

module.exports = {
  'enemies_defeated_userid': [],
  'enemies_defeated': [],
  'enemies_defeated_enemies': []
};

// lets you use aboslute path for requires.
// instead of require('./utils/messages.json') use include('utils/messages.json') works in any file
global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

function loadCmdDir(cDir) {
  fs.readdir(__dirname + `/commands/${cDir}/`, (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) {
      return console.log('No commands to load.');
    }
    console.log(`Loading ${jsfiles.length} commands from ${cDir}.`);

    jsfiles.forEach((f, i) => {
      let props = require(__dirname + `/commands/${cDir}/${f}`);
      console.log(`${i + 1}: ${f} loaded.`);
      client.commands.set(props.help.name, props);
    });
  })
}

// configuration
const botsettings = include('config.json');
const prefix = botsettings.prefix;

//utils
const utils = include('utils.js');
const messages = include('data/messages.json');
const emotes = include('data/emojiCharacters.js');

//data
const areas = include('data/areas.js');
const death_messages = include('data/death_messages.js');
const items = include('data/items.js');
const locations = include('data/locations.js');
const enemy_modifiers = include('data/enemy_modifiers.js');

// import commands from ./commands
// only includes files ending in .js
client.commands = new Discord.Collection();

for (var x = 0; x < botsettings.commandDirs.length; x++) {
  loadCmdDir(botsettings.commandDirs[x]);
}

client.on('message', async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  let messageArray = msg.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) return;

  await utils.insertUserIntoDatabase(msg.author, client, msg).catch((err) => {
    return utils.catchSQLError(err, client, msg);
  });

  let cmd = client.commands.get(command.slice(prefix.length))
  if (cmd) {
    // log commands to console if consoleLogCmds in config is true
    if (botsettings.consoleLogCmds == "true") {
      var dt = new Date();
      var utcDate = dt.toUTCString();
      console.log(`${utcDate} ${msg.guild.name}: ${msg.author.tag} >> ${msg.content}`);
    }
    await cmd.run(client, msg, args);
  }

});

client.on('ready', async () => {
  console.log(`Playing on ${client.guilds.size} guilds with ${client.users.size - 1} users.`);
  utils.generateDatabase(client);
});

client.on('guildCreate', (guild) => {
  console.log(`I have joined the guild ${guild.name}`);
  sql.run('INSERT OR IGNORE INTO settings (guildid) VALUES (?)', [guild.id]);
});

client.on('guildDelete', (guild) => {
  console.log(`I have left the guild ${guild.name}`);
});

client.on('guildMemberAdd', (member) => {
  try {
    utils.insertUserIntoDatabase(member);
  } catch (err) {
    if (err === 'SQLITE_MISUSE') {
      sql.open('./database.sqlite');
      utils.insertUserIntoDatabase(member);
    }
  }
});

client.login(process.env.TOKEN).then(() => {
  // client.guilds.get(botsettings.botGuildID).channels.get(botsettings.botGuildReportChannelID).send('\`\`\`Bot was restarted..\`\`\`');
});