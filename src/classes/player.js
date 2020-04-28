class Player {
  constructor (row, inventory) {
    this.inventory = inventory
    this.name = row.name
    this.health = parseFloat(row.health).toFixed(2)
    this.accuracy = row.accuracy
    this.critical = row.critical

    this.getWeaponValues() // Access the database..

    this.getWeapons() // Get the weapon names equipped..

    // These have to be after the method 'getWeaponValues()'
    this.damage = parseFloat((this.player_damage_left + this.player_damage_right) / 2).toFixed(2)
    this.accuracy = parseFloat((this.player_accuracy_left + this.player_accuracy_right) / 2).toFixed(2)
    this.critical = parseFloat((this.player_critical_left + this.player_critical_right) / 2).toFixed(2)
  }

  setHealth (value) {
    this.health = value
  }

  getWeapons () {
    if (this.player_weapon_left == undefined && this.player_weapon_right == undefined) {
      this.weapons = 'hands'
    } else if (this.player_weapon_left == undefined && this.player_weapon_right != undefined) {
      this.weapons = this.player_weapon_right
    } else if (this.player_weapon_left != undefined && this.player_weapon_right == undefined) {
      this.weapons = this.player_weapon_left
    } else {
      this.weapons = this.player_weapon_left + ' & ' + this.player_weapon_right
    }
  }

  getWeaponValues () {
    const equipped = []
    for (const item of this.inventory) {
      if (item.equipSlot == 'righthanditem') {
        equipped.push(item.equipSlot)
        this.player_weapon_right = item.type
        this.player_damage_right = item.damage
        this.player_accuracy_right = item.accuracy
        this.player_critical_right = item.critical
      }
      if (item.equipSlot == 'lefthanditem') {
        equipped.push(item.equipSlot)
        this.player_weapon_left = item.type
        this.player_damage_left = item.damage
        this.player_accuracy_left = item.accuracy
        this.player_critical_left = item.critical
      }
    }
    if (equipped.length == 0) { // Default weapon properties for both left and right hand weapons if they are not present in player inventory.
      this.player_damage_left = 1
      this.player_damage_right = 1
      this.player_accuracy_left = 0.9
      this.player_accuracy_right = 0.9
      this.player_critical_left = 0.15
      this.player_critical_right = 0.15
    } else if (equipped.includes('lefthanditem') && !equipped.includes('righthanditem')) { // If right hand weapon exists but left hand weapon does not, set right hand weapon properties to left hand weapon properties.
      this.player_damage_right = this.player_damage_left
      this.player_accuracy_right = this.player_accuracy_left
      this.player_critical_right = this.player_critical_left
    } else if (!equipped.includes('lefthanditem') && equipped.includes('righthanditem')) { // If left hand weapon exists but right hand weapon does not, set left hand weapon properties to right hand weapon properties.
      this.player_damage_left = this.player_damage_right
      this.player_accuracy_left = this.player_accuracy_right
      this.player_critical_left = this.player_critical_right
    }
  }
}

module.exports = Player
