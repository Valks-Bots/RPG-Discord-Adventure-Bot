module.exports = {
  types: [
    'sword',
    'axe',
    'pike',
    'dagger'
  ],
  sword: {
    damageMin: 2,
    damageMax: 4,
    valueMin: 100,
    valueMax: 1000,
    accuracyMin: 0.5,
    accuracyMax: 0.95,
    criticalMin: 0.3,
    criticalMax: 0.99,
    rarityMax: 'common'
  },
  axe: {
    damageMin: 3,
    damageMax: 6,
    valueMin: 100,
    valueMax: 1000,
    accuracyMin: 0.3,
    accuracyMax: 0.7,
    criticalMin: 0.3,
    criticalMax: 0.99,
    rarityMax: 'uncommon'
  },
  pike: {
    damageMin: 5,
    damageMax: 12,
    valueMin: 400,
    valueMax: 1000,
    accuracyMin: 0.1,
    accuracyMax: 0.6,
    criticalMin: 0.6,
    criticalMax: 0.99,
    rarityMax: 'rare'
  },
  dagger: {
    damageMin: 1,
    damageMax: 3,
    valueMin: 100,
    valueMax: 1000,
    accuracyMin: 0.8,
    accuracyMax: 0.95,
    criticalMin: 0.6,
    criticalMax: 0.99,
    rarityMax: 'common'
  },
  weapons: [{
    id: 1,
    name: 'pebble',
    lore: 'If you can actually hit the enemy in the first place than this pebble is for you!',
    damage: 1.2,
    critical: 0.2,
    accuracy: 0.6,
    value: 1
  },
  {
    id: 2,
    name: 'stick',
    lore: 'You must have found it off the ground somewhere..',
    damage: 1.4,
    critical: 0.2,
    accuracy: 0.9,
    value: 1
  },
  {
    id: 3,
    name: 'sword',
    lore: 'It seems you found someone elses sword..',
    damage: 1.7,
    critical: 0.9,
    accuracy: 0.9,
    value: 15
  },
  {
    id: 4,
    name: 'long sword',
    lore: 'Does a moderate amount of damage and is overall a decent weapon to have.',
    damage: 2.3,
    critical: 0.4,
    accuracy: 0.9,
    value: 20
  },
  {
    id: 5,
    name: 'pike',
    lore: 'Has a very pointy tip!',
    damage: 6,
    critical: 0.5,
    accuracy: 0.7,
    value: 120
  }
  ],
  armor: []
}
