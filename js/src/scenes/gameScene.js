class GameScene extends Scene {
    constructor(scene, camera) {
        super(scene, camera);
        this.mouse = new THREE.Vector2();
        this.selectedToBePlacedObject;
        this.selectedTurret;
        this.isHoveringValidSpot;

        this.timeoutCount = 0;
        this.turretEnemyDeadEventHandlers = [];
        this.gameIsOver = false;
        this.shopPanelVisibility = true;

        document.getElementById("nextWaveButton").addEventListener("click", (event) => {
            this.timeoutCount = 1;
            this.setWaveFinishedPanelVisibility(false);
            this.startTimeout();
        })

        document.getElementById("goToShopButton").addEventListener("click", (event) => {
            if (!this.gameIsOver) {
                this._toggleShopPanel();
            }
        })

        this.waveFinishedPanel = document.getElementById("game-wave-finished-container");
        this.inGamePanel = document.getElementById("in-game-container");
        this.moneyText = document.getElementById("money-value");
        this.addMoneyText = document.getElementById("add-money-value");
        this.waveText = document.getElementById("wave-value");
        this.enemiesLeftText = document.getElementById("ememies-left-value");
        this.livesText = document.getElementById("lives-value");
        this.removeLivesText = document.getElementById("remove-lives-value");

        this.waveStartingText = document.getElementById("wave-starting-text");

        this.turretDetailsPanel = document.getElementById("turret-details-container");
        this.turretDetailsNameText = document.getElementById("turret-name-value");
        this.turretDetailsReachDistanceText = document.getElementById("turret-reach-distance-value");
        this.turretDetailsFiringSpeedText = document.getElementById("turret-firing-speed-value");
        this.turretDetailsDamageText = document.getElementById("turret-damage-value");

        this.shopPanel = document.getElementById("shop-container");
        this.shopContentPanel = document.getElementById("shop-content-container");

        this._CreateShopPanel();

        this.lives = 3;
        this.money = 30;
        this.waveCount = 0;
        this.waveTotalEnemiesCount = 0;
        this.waveRemainingEnemiesCount = 0;
        this.allEnemies = [];

        this._UpdateShopPanelItems();

        this.setWaveFinishedPanelVisibility(false);

        this.waveManager = new WaveManager();
        this.addToBeBeUpdated(this.waveManager);

        // this.updateMoney(151);
        this.updateWave(0);

        this.addToScene(new THREE.AmbientLight(0x404040, 0.2));// soft white light

        this.orbitControls = new OrbitControls(this.camera, document.getElementById('app'));
        this.orbitControls.mouseMovementPan({ clientX: -window.innerWidth / 8, clientY: -window.innerHeight / 4 });

        this.addEventListener("mousemove", (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        });

        this.addEventListener("pointerdown", (event) => {

            if (this.gameIsOver) {
                return
            }

            if (event.button == 0) {
                if (this.selectedTurret) {
                    this.showTurretDetailsPanel(false)
                    this.selectedTurret.setReachRadiusVisibility(false);
                }

                if (this.selectedToBePlacedObject) {
                    if (this.isHoveringValidSpot) {

                        this.updateMoney(- this.selectedToBePlacedObject.data.price);

                        this.selectedToBePlacedObject.place();

                        var gridPosition = this._calculateGridPosition(this.selectedToBePlacedObject.mesh.position)
                        this.map[gridPosition.x][gridPosition.z] = 5;
                        this.selectedToBePlacedObject = undefined;
                    }
                } else {
                    const intersections = this.raycastFromCamera(true);

                    for (let i = 0; i < intersections.length; i++) {
                        const intersection = intersections[i];

                        if (intersection.object.ignoreRaycast) {
                            continue;
                        }

                        if (intersection.object.parent && intersection.object.parent.isTurret && intersection.object.parent.component) {
                            this.selectedTurret = intersection.object.parent.component;
                            this.selectedTurret.setReachRadiusVisibility(true);
                            this.showTurretDetailsPanel(true, this.selectedTurret.data)
                            break;
                        }
                    }
                }
            }
        });

        this.sceneLeave();
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (this.gameIsOver) {
            this.selectedToBePlacedObject = undefined;
            return;
        }

        if (this.selectedToBePlacedObject) {

            const intersects = this.raycastFromCamera();
            this.isHoveringValidSpot = false;

            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.isMapCell) {
                    var gridPosition = this._calculateGridPosition(intersects[i].point);

                    if (!intersects[i].object.isPath && this._checkIfHoverPositionIsCorrect(gridPosition)) {
                        this.selectedToBePlacedObject.setMaterialColorError(false);

                        this.isHoveringValidSpot = true;
                    } else {
                        this.selectedToBePlacedObject.setMaterialColorError(true);
                    }

                    this.selectedToBePlacedObject.mesh.position.set(gridPosition.x, gridPosition.y, gridPosition.z);

                    break;
                }
            }
        }
    }

    _checkIfHoverPositionIsCorrect(gridPosition) {
        if (gridPosition.x < 0 || gridPosition.y < 0) {
            return false;
        }
        if (gridPosition.x >= this.map.length || gridPosition.x >= this.map[0].length) {
            return false;
        }
        return this.map[gridPosition.x][gridPosition.z] == 0;
    }

    _calculateGridPosition(point) {
        var gridPositonX = parseInt((point.x / GridSize + GridSize / 2) * GridSize);
        var gridPositonY = point.y;
        var gridPositonZ = parseInt((point.z / GridSize + GridSize / 2) * GridSize);

        return { x: gridPositonX, y: gridPositonY, z: gridPositonZ };
    }

    addEnemy(gameobject) {
        this.add(gameobject)
        this.allEnemies.push(gameobject);
    }

    setMap(mapPath) {

        var me = this;
        var loader = new THREE.FileLoader();
        loader.load(
            mapPath,
            function (data) {
                const map = JSON.parse(data);
                var waypoints = loadMap(map, me.scene, GridSize);

                me.map = map.map;
                me.waveManager.setData(me, waypoints, waveData);
                me.waveCount = waveData.length;

                const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
                dirLight.position.set(3, 10, 10);
                var d = map.map.length;
                dirLight.castShadow = true;
                dirLight.castShadow = true;
                dirLight.shadow.camera.left = - d;
                dirLight.shadow.camera.right = d;
                dirLight.shadow.camera.top = d;
                dirLight.shadow.camera.bottom = - d;
                dirLight.shadowCameraVisible = true;
                dirLight.shadow.camera.near = 1;
                dirLight.shadow.camera.far = 50;
                me.addToScene(dirLight);

                // const helper = new THREE.CameraHelper(dirLight.shadow.camera);
                // this.addToScene(helper);

                me.updateEnemiesLeft()
                me.updateWave(0)
            },
            undefined,
            function (err) {
                console.error('An error happened');
                console.error(err)
            }
        );
    }

    sceneEnter() {
        this.orbitControls.enabled = true;
        this.inGamePanel.style.display = "flex";

        if (!this.waveManager.isWavePlaying) {
            this.setWaveFinishedPanelVisibility(true);
        }
    }

    sceneLeave() {
        this.removeLivesText.classList.remove("add-value");
        this.addMoneyText.classList.remove("add-value");
        this.orbitControls.enabled = false;
        this.inGamePanel.style.display = "none";
        this.setWaveFinishedPanelVisibility(false);
    }

    setWaveFinishedPanelVisibility(visible) {
        if (this.gameIsOver) {
            this.waveFinishedPanel.style.display = "none";

        } else {
            this.waveFinishedPanel.style.display = visible ? "flex" : "none";

        }
    }

    showTurretDetailsPanel(visible, data) {
        this.turretDetailsPanel.style.display = visible ? "flex" : "none";

        if (visible) {
            this.turretDetailsNameText.innerHTML = data.name;
            this.turretDetailsReachDistanceText.innerHTML = data.reachDistance;
            this.turretDetailsFiringSpeedText.innerHTML = data.firingSpeed;
            this.turretDetailsDamageText.innerHTML = data.bulletData.damage;
        }
    }

    gameover(win) {
        this.gameIsOver = true;
        if (win) {
            this.waveStartingText.innerHTML = "GAME WON";
        } else {
            this.waveStartingText.innerHTML = "GAME OVER";
        }

        this.setWaveFinishedPanelVisibility(false);
        this.showTurretDetailsPanel(false, undefined);
        this.shopPanel.style.display = "none";

        if (!this.shopPanelVisibility) {
            this._toggleShopPanel();
        }
    }

    updateMoney(amount) {

        this.addMoneyText.classList.remove("add-money-value-positive");
        this.addMoneyText.classList.remove("add-money-value-negative");

        if (amount > 0) {
            this.addMoneyText.innerHTML = "+" + amount;
            this.addMoneyText.classList.add("add-money-value-positive");
        }
        else {
            this.addMoneyText.innerHTML = amount;
            this.addMoneyText.classList.add("add-money-value-negative");
        }

        this.addMoneyText.classList.remove("add-value");

        void this.addMoneyText.offsetWidth;
        this.addMoneyText.classList.add("add-value");

        this.money += amount;
        this.moneyText.innerHTML = this.money;

        this._UpdateShopPanelItems();
    }

    removeOneLife() {
        if (this.lives > 0) {
            this.removeLivesText.innerHTML = "-1";

            this.removeLivesText.classList.remove("add-value");

            void this.removeLivesText.offsetWidth;
            this.removeLivesText.classList.add("add-value");

            this.lives--;
            this.livesText.innerHTML = this.lives;
            if (this.lives == 0) {
                this.gameover(false);
            }
        }
    }

    updateWave(wave) {
        this.waveText.innerHTML = (wave + 1) + "/" + this.waveCount;
    }

    updateEnemiesLeft() {
        this.enemiesLeftText.innerHTML = this.waveRemainingEnemiesCount + "/" + this.waveTotalEnemiesCount;
    }

    removeEnemy(enemy, enemyHasArrivedAtDestination) {
        if (enemyHasArrivedAtDestination) {
            this.removeOneLife();
        } else {
            this.updateMoney(enemy.data.money)
        }

        this.turretEnemyDeadEventHandlers.forEach(handler => {
            handler(enemy.mesh)
        });

        this.remove(enemy);
        var index = this.allEnemies.indexOf(enemy);
        if (index > -1) {
            this.allEnemies.splice(index, 1);
        }

        this.waveRemainingEnemiesCount--;
        this.updateEnemiesLeft();

        if (this.waveRemainingEnemiesCount == 0) {
            if (this.waveManager.isFinished()) {
                this.gameover(true);
            }
            else {
                const currentWave = this.waveManager.currentWave();
                this.updateMoney(currentWave.money);

                this.setWaveFinishedPanelVisibility(true);
            }
        }
    }

    startTimeout() {
        if (this.timeoutCount > 0) {
            this.waveStartingText.innerHTML = "Wave starting in  " + this.timeoutCount;
            setTimeout(() => {
                this.timeoutCount--;
                this.startTimeout();
            }, 1000);
        } else {
            this.waveStartingText.innerHTML = "";
            const wave = this.waveManager.startNextWave();

            this.waveTotalEnemiesCount = wave.enemyCount;
            this.waveRemainingEnemiesCount = wave.enemyCount;
            this.updateEnemiesLeft()
            this.updateWave(wave.waveIndex)
        }
    }

    _toggleShopPanel() {
        this.shopPanel.classList.remove("hide-shop-panel");
        this.shopPanel.classList.remove("show-shop-panel");

        void this.addMoneyText.offsetWidth;

        this.shopPanelVisibility = !this.shopPanelVisibility;
        if (this.shopPanelVisibility) {
            this.shopPanel.classList.add("show-shop-panel");
        }
        else {
            this.shopPanel.classList.add("hide-shop-panel");
        }
    }

    _UpdateShopPanelItems() {
        for (let i = 0; i < this.shopContentPanel.children.length; i++) {
            const shopItemDiv = this.shopContentPanel.children[i];


            var notEnoughMoneyDiv = shopItemDiv.getElementsByClassName("shop-content-item-not-enough-money")[0];
            var button = shopItemDiv.getElementsByTagName("button")[0];

            if (turretData[i].price > this.money) {

                button.disabled = true;
                notEnoughMoneyDiv.style.display = "block";
            }
            else {
                button.disabled = false;
                notEnoughMoneyDiv.style.display = "none";
            }
        }
    }

    _CreateShopPanel() {

        for (let i = 0; i < turretData.length; i++) {
            const data = turretData[i];

            var contentItemDiv = document.createElement("div")
            contentItemDiv.classList.add("shop-content-item");

            contentItemDiv.appendChild(CreatePropertyInShopMenu("Name", data.name));
            contentItemDiv.appendChild(CreatePropertyInShopMenu("Damage", data.bulletData.damage));
            contentItemDiv.appendChild(CreatePropertyInShopMenu("Firing Speed", data.firingSpeed));
            contentItemDiv.appendChild(CreatePropertyInShopMenu("Reach Distance", data.reachDistance));
            contentItemDiv.appendChild(CreatePropertyInShopMenu("Price", data.price));

            var contentItemImg = document.createElement("img");
            contentItemImg.classList.add("shop-content-item-img");
            contentItemImg.src = data.imagePath;
            contentItemDiv.appendChild(contentItemImg);

            var contentItemButton = document.createElement("button");
            contentItemButton.classList.add("btn");
            contentItemButton.classList.add("btn-style");
            contentItemButton.classList.add("btn-blue");
            contentItemButton.innerHTML = "BUY"
            contentItemButton.onclick = (event) => {

                if (!this.selectedToBePlacedObject || this.selectedToBePlacedObject.data != data) {
                    this.selectedToBePlacedObject = new Turret(allTurretData[i], this);
                    this.add(this.selectedToBePlacedObject);
                    this.selectedToBePlacedObject.setMaterialColorError(false);
                }
            }
            contentItemDiv.appendChild(contentItemButton);

            var contentItemNotEnoughMoney = document.createElement("div");
            contentItemNotEnoughMoney.classList.add("shop-content-item-not-enough-money");
            contentItemNotEnoughMoney.innerHTML = "Not Enough Money!";
            contentItemDiv.appendChild(contentItemNotEnoughMoney);

            this.shopContentPanel.appendChild(contentItemDiv);
        }

        function CreatePropertyInShopMenu(name, value) {
            var div = document.createElement("div");

            var nameSpan = document.createElement("span");
            nameSpan.classList.add("shop-content-item-title");
            nameSpan.innerHTML = name + ": ";

            var valueSpan = document.createElement("span");
            valueSpan.innerHTML = value;

            div.appendChild(nameSpan);
            div.appendChild(valueSpan);
            return div;
        }
    }
}