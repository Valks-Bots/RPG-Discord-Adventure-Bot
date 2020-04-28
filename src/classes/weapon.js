const items = include('data/items.js')

class Weapon {
  constructor (randomType) {
    const randomGen = Math.random()

    this.type = items[randomType]
    this.name = randomType
    this.damage = parseFloat(this.type.damageMin + (randomGen * this.type.damageMax)).toFixed(2)
    this.value = Math.floor(this.type.valueMin + (randomGen * this.type.valueMax))
    this.accuracy = parseFloat(this.type.accuracyMin + (randomGen * this.type.accuracyMax)).toFixed(2)
    if (this.accuracy > 1.0) {
      this.accuracy = 1.0
    }
    this.critical = parseFloat(this.type.criticalMin + (randomGen * this.type.criticalMax)).toFixed(2)
    if (this.critical > 1.0) {
      this.critical = 1.0
    }
  }
}

module.exports = Weapon
