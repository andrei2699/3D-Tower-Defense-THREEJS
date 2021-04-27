const turretData = [
    {
        name: "2 Barrel Turret",
        assetPath: 'assets/models/turrets/BasicTurret.json',
        imagePath: 'assets/images/img1.jpg',
        reachDistance: 2.5,
        firingSpeed: 0.25,
        price: 10,
        bulletData: {
            damage: 1,
            speed: 20,
            radius: 0.05,
            color: 0x694b11
        }
    }
];

const enemiesData = [{
    name: "basic",
    assetPath: 'assets/models/enemies/Enemy.json',
    speed: 1,
    health: 10,
    meshSize: 0.5,
    color: 0xffff00
},
{
    name: "small",
    assetPath: 'assets/models/enemies/Enemy.json',
    speed: 5,
    health: 2,
    meshSize: 0.25,
    color: 0x00ffff

}]

const waveData = [
    {
        enemyCount: 3,
        enemyTypes: ['basic'],
        spawnTime: 1
    },
    {
        enemyCount: 5,
        enemyTypes: ['small'],
        spawnTime: 0.4
    },

    {
        enemyCount: 4,
        enemyTypes: ['basic', 'small'],
        spawnTime: 0.8
    }
]