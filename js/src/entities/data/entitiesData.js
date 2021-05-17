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
    },
    {
        name: 'cannonShot',
        path: 'assets/sounds/effects/CannonShot.wav'
    },
    {
        name: 'fastEnemyDeath',
        path: 'assets/sounds/effects/FastEnemyDeath.wav'
    }
];

const turretData = [
    {
        name: "Basic Turret",
        assetPath: 'assets/models/turrets/BasicTurret.json',
        imagePath: 'assets/images/turrets/BlackTurretPreview.png',
        reachDistance: 2,
        firingSpeed: 0.25,
        price: 40,
        bulletData: {
            damage: 0.3,
            speed: 15,
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
        name: "Rapid Fire Turret",
        assetPath: 'assets/models/turrets/RedBasicTurret.json',
        imagePath: 'assets/images/turrets/RedTurretPreview.png',
        reachDistance: 1.75,
        firingSpeed: 0.05,
        price: 60,
        bulletData: {
            damage: 0.1,
            speed: 10,
            radius: 0.035,
            color: 0xeb0909
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
        name: "High Damage Turret",
        assetPath: 'assets/models/turrets/BlueBasicTurret.json',
        imagePath: 'assets/images/turrets/BlueTurretPreview.png',
        reachDistance: 4,
        firingSpeed: 2,
        price: 100,
        bulletData: {
            damage: 6,
            speed: 3,
            radius: 0.12,
            color: 0x000000
        },
        soundEffects: [
            {
                action: 'shoot',
                name: 'cannonShot'
            },
            {
                action: 'place',
                name: 'turretPlace'
            }
        ]
    }
];

const enemiesData = [
    {
        name: "basic",
        assetPath: 'assets/models/enemies/Enemy.json',
        speed: 1,
        health: 10,
        meshSize: 0.5,
        color: 0xffff00,
        money: 10,
        soundEffects: [
            {
                action: 'death',
                name: 'enemyDeath'
            }
        ]
    },
    {
        name: "medium",
        assetPath: 'assets/models/enemies/Enemy.json',
        speed: 0.8,
        health: 20,
        meshSize: 0.6,
        color: 0x11a811,
        money: 15,
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
        speed: 1.5,
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
    },
    {
        name: "fast",
        assetPath: 'assets/models/enemies/Enemy.json',
        speed: 5,
        health: 1,
        meshSize: 0.25,
        color: 0xd91e1e,
        money: 8,
        soundEffects: [
            {
                action: 'fastEnemyDeath',
                name: 'enemyDeath'
            }
        ]
    },
    {
        name: "large",
        assetPath: 'assets/models/enemies/Enemy.json',
        speed: 0.5,
        health: 80,
        meshSize: 1,
        color: 0xac19d1,
        money: 40,
        soundEffects: [
            {
                action: 'death',
                name: 'enemyDeath'
            }
        ]
    },
]