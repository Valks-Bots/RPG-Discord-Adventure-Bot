module.exports = [{
  type: 'grasslands',
  level: 1,
  encounters: [{
    name: 'slime',
    health: 10,
    damage: 1,
    accuracy: 0.2,
    lootchance: 0.9,
    fleechance: 0.1
  },
  {
    name: 'rock',
    health: 15,
    damage: 2,
    accuracy: 0.4,
    lootchance: 1.0,
    fleechance: 0.0
  },
  {
    name: 'stick',
    health: 6,
    damage: 5,
    accuracy: 0.4,
    lootchance: 0.5,
    fleechance: 0.0
  },
  {
    name: 'leaf',
    health: 9,
    damage: 0.1,
    accuracy: 1.0,
    lootchance: 0.8,
    fleechance: 0.4
  },
  {
    name: 'tree',
    health: 13,
    damage: 3,
    accuracy: 0.3,
    lootchance: 0.7,
    fleechance: 0.1
  }
  ]
},
{
  type: 'hills',
  level: 2,
  encounters: [{
    name: 'bird',
    health: 25,
    damage: 4,
    accuracy: 0.9,
    lootchance: 0.8,
    fleechance: 0.6
  },
  {
    name: 'hawk',
    health: 30,
    damage: 5,
    accuracy: 0.9,
    lootchance: 0.8,
    fleechance: 0.4
  },
  {
    name: 'thunder bird',
    health: 50,
    damage: 8,
    accuracy: 0.7,
    lootchance: 0.5,
    fleechance: 0.3
  }
  ]
},
{
  type: 'forest',
  level: 3,
  encounters: [{
    name: 'spirit',
    health: 100,
    damage: 15,
    accuracy: 0.6,
    lootchance: 0.2,
    fleechance: 0.1
  }]
},
{
  type: 'caves',
  level: 4,
  encounters: [{
    name: 'shadow',
    health: 200,
    damage: 35,
    accuracy: 0.8,
    lootchance: 0.2,
    fleechance: 0.1
  }]
},
{
  type: 'village',
  level: 5,
  encounters: [{
    name: 'villager',
    health: 20,
    damage: 40,
    accuracy: 0.9,
    lootchance: 0.2,
    fleechance: 0.1
  }]
}
]
