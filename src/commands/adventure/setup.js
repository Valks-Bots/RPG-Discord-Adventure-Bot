const sql = require('sqlite')

const botsettings = include('config.json')
const utils = include('utils.js')

const messages = include('data/messages.json')
const emotes = include('data/emojiCharacters.js')

module.exports.run = (client, msg, args) => {
  // Setup..
  let name
  let age
  let personality

  utils.sendEmbed(msg, 'What name would you like?').then(m => {
    const setup_name = utils.collector(msg)
    setup_name.on('collect', message => {
      name = message.content

      // Check if the name they inputted is too long.
      if (name.length > 30) return utils.editEmbed(m, msg, 'That name is too long!')

      // Name inputted, stop the collector..
      setup_name.stop()

      // Update the database with the name to the respective user.
      sql.run('UPDATE userprofile SET name = ? WHERE userid = ?', [name, msg.author.id])

      utils.editEmbed(m, msg, `Okay, your name will be ${message.content} from now on.`)
      utils.sendEmbed(msg, 'What age do you want to be?').then(m => {
        const setup_age = utils.collector(msg)
        setup_age.on('collect', message => {
          age = message.content
          if (isNaN(age)) {
            return utils.editEmbed(m, msg, 'You need to ender a valid number for your age, what age do you want be?')
          }

          setup_age.stop()
          sql.run('UPDATE userprofile SET age = ? WHERE userid = ?', [age, msg.author.id])
          utils.editEmbed(m, msg, `Okay, you're now ${age} years old!`)

          utils.sendEmbed(msg, 'Male or female?').then(m => {
            const setup_personality = utils.collector(msg)
            setup_personality.on('collect', message => {
              personality = message.content.toLowerCase()
              if (personality.includes('male')) {
                sql.run('UPDATE userprofile SET gender = ? WHERE userid = ?', ['Male', msg.author.id])
                utils.editEmbed(m, msg, 'Okay, you\'re now a male.')
                setup_personality.stop()
              }

              if (personality.includes('female')) {
                sql.run('UPDATE userprofile SET gender = ? WHERE userid = ?', ['Female', msg.author.id])
                utils.editEmbed(m, msg, 'Okay, you\'re now a female.')
                setup_personality.stop()
              }
            })

            setup_personality.on('end', message => {
              if (personality === undefined) utils.editEmbed(m, msg, 'You did not specify a personality in time!')
            })
          })
        })

        setup_age.on('end', message => {
          if (age === undefined) utils.editEmbed(m, msg, 'You did not specify a age in time!')
        })
      })
    })

    setup_name.on('end', message => {
      // If they did not specify a name in time than send this message.
      if (name === undefined) utils.editEmbed(m, msg, 'You did not specify a name in time!')
    })
  })
}

module.exports.help = {
  name: 'setup'
}
