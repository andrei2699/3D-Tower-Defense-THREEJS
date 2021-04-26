class WaveManager {
    constructor() {
        this.waves = [];
        this.currentWaveIndex = 0;
        this.spawnTime = 0;
        this.spawnScene = undefined;
        this.isWavePlaying = false;
        this.currentEnemyIndex = 0;
    }

    setData(scene, waypoints, waves) {
        this.spawnScene = scene;
        this.waypoints = waypoints;
        this.waves = waves;
    }

    startNextWave() {
        this.isWavePlaying = true;
        this.currentEnemyIndex = 0;

        return {
            waveIndex: this.currentWaveIndex,
            enemyCount: this.waves[this.currentWaveIndex].enemyCount
        };
    }

    update(deltaTime) {
        if (!this.isWavePlaying) {
            return;
        }

        if (this.currentWaveIndex >= this.waves.length) {
            return;
        }
        const currentWave = this.waves[this.currentWaveIndex];

        this.spawnTime += deltaTime;

        if (this.spawnTime >= currentWave.spawnTime) {
            this.spawnTime = 0;

            if (currentWave.enemyCount == 0) {
                this.currentWaveIndex++;
                this.isWavePlaying = false;
            } else {
                // spawn new enemy
                // use round robin

                currentWave.enemyCount--;

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