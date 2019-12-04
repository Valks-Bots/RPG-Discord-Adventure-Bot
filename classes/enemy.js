const enemy_modifiers = include('data/enemy_modifiers.js')
const areas = include('data/areas.js')
const items = include('data/items.js')

const utils = include('utils.js')

const Weapon = include('classes/weapon.js')

class Enemy {
  constructor (row) {
    // Enemy
    this.row = row
    this.modifier = enemy_modifiers[Math.floor(Math.random() * enemy_modifiers.length)]
    this.enemy = areas[this.row.level - 1].encounters[Math.floor(Math.random() * areas[this.row.level - 1].encounters.length)]
    this.name = this.modifier.name + ' ' + this.enemy.name
    this.health = parseFloat(this.enemy.health * this.modifier.modifier).toFixed(2)
    this.lootchance = this.enemy.lootchance * this.modifier.modifier
    this.fleechance = this.enemy.fleechance

    // Enemy Weapon
    const randomType = utils.random(items.types)
    const weapon = new Weapon(randomType)
    this.weapon_damage = parseFloat(weapon.damage * this.modifier.modifier).toFixed(2)
    this.weapon_accuracy = weapon.accuracy
    this.weapon_critical = weapon.critical
    this.weapon_name = weapon.name
    this.weapon_value = weapon.value

    this.value = ((parseFloat(this.health) + parseFloat(this.weapon_damage)) / 2).toFixed(2)
  }

  dynamicDamage (value) {
    return value = parseFloat(this.weapon_damage - (this.weapon_damage / 2) + Math.random(this.weapon_damage)).toFixed(2)
  }
}

module.exports = Enemy
