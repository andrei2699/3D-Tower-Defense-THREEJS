class MainMenuScene extends Scene {
    constructor(scene, camera) {
        super(scene, camera);

        this.mainMenu = document.getElementById("main-menu-container");
        this.levelsPanel = document.getElementById("levels-panel");
        this._createLevelsPanel();

        this.tutorialPanel = document.getElementById("tutorial-panel");
        this.tutorialPanelVisible = false;

        this.orbitControls = new OrbitControls(this.camera, document.getElementById('app'));
        this.orbitControls.mouseMovementPan({ clientX: -window.innerWidth / 8, clientY: -window.innerHeight / 4 })
        this.orbitControls.enabled = false;

        document.getElementById("tutorialButton").addEventListener("click", (event) => {
            this.setTutorialPanelVisibility(!this.tutorialPanelVisible);
        })

        this.waveManager = new InfiniteWaveManager();
        this.addToBeBeUpdated(this.waveManager)

        this.map = undefined;
        var me = this;
        var loader = new THREE.FileLoader();
        loader.load(
            'assets/levels/levelmenu.json',
            function (data) {
                const map = JSON.parse(data);
                me.waypoints = loadMap(map, me.scene, GridSize);
                me.map = map;

                var startPos = me.waypoints[0];
                var endPos = me.waypoints[me.waypoints.length - 1];
                startPos = { x: startPos.x, y: 0.75, z: startPos.y };
                endPos = { x: endPos.x, y: 0.75, z: endPos.y };

                me.add(new EndPointCube(startPos, startPointColor, 1))
                me.add(new EndPointCube(endPos, endPointColor, -1))
            },
            undefined,
            function (err) {
                console.error('An error happened');
                console.error(err)
            }
        );
        this.setTutorialPanelVisibility(false);
        this.allEnemies = [];
        this.turretEnemyDeadEventHandlers = [];
        this.waveRemainingEnemiesCount = 0;
    }

    sceneEnter() {
        this.mainMenu.style.display = "flex";
        this.setTutorialPanelVisibility(false);
    }

    sceneLeave() {
        this.mainMenu.style.display = "none";
        this.setTutorialPanelVisibility(false);
    }

    loadModels() {
        this._loadFoliage(this.map);
        var me = this;

        placeTurret(allTurretData[0], { x: 2, y: 0.5, z: 2 });
        // placeTurret(allTurretData[1], { x: 5, y: 0.5, z: 3 });
        placeTurret(allTurretData[2], { x: 4, y: 0.5, z: 7 });

        function placeTurret(data, pos) {
            var turret = new Turret(data, me);
            me.add(turret);
            turret.mesh.position.set(pos.x, pos.y, pos.z);
            turret.place();
        }

        this.waveManager.setData(this, this.waypoints, this.map.waveData);

        const wave = this.waveManager.startNextWave();
        this.waveRemainingEnemiesCount = wave.enemyCount;
    }

    setTutorialPanelVisibility(visible) {
        this.tutorialPanelVisible = visible;
        this.tutorialPanel.style.display = visible ? "flex" : "none";
    }

    addEnemy(gameobject) {
        this.add(gameobject)
        this.allEnemies.push(gameobject);
    }

    removeEnemyFromAllEnemies(enemy, enemyHasArrivedAtDestination) {

        this.turretEnemyDeadEventHandlers.forEach(handler => {
            handler(enemy.mesh)
        });

        var index = this.allEnemies.indexOf(enemy);
        if (index > -1) {
            this.allEnemies.splice(index, 1);
        }
    }

    removeEnemy(enemy) {
        this.remove(enemy);
        this.waveRemainingEnemiesCount--;

        if (this.waveRemainingEnemiesCount == 0) {

            const wave = this.waveManager.startNextWave();

            this.waveRemainingEnemiesCount = wave.enemyCount;
        }
    }

    _createLevelsPanel() {
        var levelCount = 4;

        for (let i = 1; i <= levelCount; i++) {
            var levelDiv = document.createElement("div")
            levelDiv.classList.add("level-panel-item");
            levelDiv.classList.add("noselect");

            levelDiv.innerHTML = "Level " + i;
            levelDiv.onclick = (event) => {
                gameScene.setMap(`assets/levels/level${i}.json`)
                changeScene(gameScene);
            }

            this.levelsPanel.appendChild(levelDiv);
        }
    }
}