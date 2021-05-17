class InfiniteWaveManager {
    constructor() {
        this.waves = [];
        this.currentWaveIndex = 0;
        this.spawnTime = 0;
        this.spawnScene = undefined;
        this.currentEnemyIndex = 0;
        this.cooldown = 1.0;
        this.currentEnemyCount = 0;
    }

    setData(scene, waypoints, waves) {
        this.spawnScene = scene;
        this.waypoints = waypoints;
        this.waves = waves;
    }

    currentWave() {
        return this.waves[this.currentWaveIndex];
    }

    startNextWave() {
        this.isWavePlaying = true;
        this.currentEnemyIndex = 0;

        this.currentEnemyCount = this.waves[this.currentWaveIndex].enemyCount;
        return {
            waveIndex: this.currentWaveIndex,
            enemyCount: this.waves[this.currentWaveIndex].enemyCount
        };
    }

    update(deltaTime) {
        if (this.waves.length == 0) {
            return
        }

        if (!this.isWavePlaying) {
            return;
        }

        if (this.cooldown >= 0) {
            this.cooldown -= deltaTime;
            return;
        }
        const currentWave = this.waves[this.currentWaveIndex];

        this.spawnTime += deltaTime;

        if (this.spawnTime >= currentWave.spawnTime) {
            this.spawnTime = 0;

            if (this.currentEnemyCount == 0) {
                this.currentWaveIndex++;
                this.currentWaveIndex %= this.waves.length;

                this.isWavePlaying = false;
                this.cooldown = 0.0;
            } else {
                this.currentEnemyCount--;

                var currentEnemyType = currentWave.enemyTypes[this.currentEnemyIndex];
                this.currentEnemyIndex++;
                if (this.currentEnemyIndex >= currentWave.enemyTypes.length) {
                    this.currentEnemyIndex = 0;
                }
                var enemyData = this.findEnemyData(currentEnemyType);

                const enemy = new Enemy(enemyData, this.waypoints, this.spawnScene);
                this.spawnScene.addEnemy(enemy)
                this.spawnScene.addToBeBeUpdated(enemy.healthbar);
            }
        }
    }

    findEnemyData(name) {
        for (let i = 0; i < allEnemiesData.length; i++) {
            if (allEnemiesData[i].data.name == name) {
                return allEnemiesData[i];
            }
        }

        return undefined;
    }

    isFinished() {
        return this.currentWaveIndex >= this.waves.length;
    }
}