const audioData = [
    {
        name: 'turretShot2',
        path: 'assets/sounds/effects/TurretShot2.wav'
    },
    {
        name: 'enemyDeath',
        path: 'assets/sounds/effects/EnemyDeath.wav'
    },
    {
        name: 'turretPlace',
        path: 'assets/sounds/effects/TurretPlace.wav'
    }
];

const turretData = [
    {
        name: "2 Barrel Turret",
        assetPath: 'assets/models/turrets/BasicTurret.json',
        imagePath: 'assets/images/turrets/BlackTurretPreview.png',
        reachDistance: 2.5,
        firingSpeed: 0.25,
        price: 10,
        bulletData: {
            damage: 1,
            speed: 20,
            radius: 0.05,
            color: 0xedd326
        },
        soundEffects: [
            {
                action: 'shoot',
                name: 'turretShot2'
            },
            {
                action: 'place',
                name: 'turretPlace'
            }
        ]
    },
    {
        name: "Burst Fire Turret",
        assetPath: 'assets/models/turrets/RedBasicTurret.json',
        imagePath: 'assets/images/turrets/RedTurretPreview.png',
        reachDistance: 1.5,
        firingSpeed: 0.15,
        price: 50,
        bulletData: {
            damage: 0.1,
            speed: 30,
            radius: 0.05,
            color: 0xedd326
        },
        soundEffects: [
            {
                action: 'shoot',
                name: 'turretShot2'
            },
            {
                action: 'place',
                name: 'turretPlace'
            }
        ]
    },
    {
        name: "Turret",
        assetPath: 'assets/models/turrets/BlueBasicTurret.json',
        imagePath: 'assets/images/turrets/BlueTurretPreview.png',
        reachDistance: 1.5,
        firingSpeed: 0.15,
        price: 50,
        bulletData: {
            damage: 0.1,
            speed: 30,
            radius: 0.05,
            color: 0xedd326
        },
        soundEffects: [
            {
                action: 'shoot',
                name: 'turretShot2'
            },
            {
                action: 'place',
                name: 'turretPlace'
            }
        ]
    }
];

const enemiesData = [{
    name: "basic",
    assetPath: 'assets/models/enemies/Enemy.json',
    speed: 1,
    health: 10,
    meshSize: 0.5,
    color: 0xffff00,
    money: 4,
    soundEffects: [
        {
            action: 'death',
            name: 'enemyDeath'
        }
    ]
},
{
    name: "small",
    assetPath: 'assets/models/enemies/Enemy.json',
    speed: 5,
    health: 2,
    meshSize: 0.25,
    color: 0x00ffff,
    money: 6,
    soundEffects: [
        {
            action: 'death',
            name: 'enemyDeath'
        }
    ]
}]

const waveData = [
    {
        enemyCount: 3,
        enemyTypes: ['basic'],
        spawnTime: 1,
        money: 20
    },
    {
        enemyCount: 5,
        enemyTypes: ['small'],
        spawnTime: 0.4,
        money: 20
    },

    {
        enemyCount: 4,
        enemyTypes: ['basic', 'small'],
        spawnTime: 0.8,
        money: 20
    }
]