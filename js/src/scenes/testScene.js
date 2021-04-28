class TestScene extends Scene {
    constructor(scene, camera) {
        super(scene, camera);

        this.gameShopTitle = document.getElementById("game-shop-title-container");

        document.getElementById("leaveShopButton").addEventListener("click", (event) => {
            changeScene(gameScene);
        })

        this.orbitControls = new OrbitControls(this.camera, document.getElementById('app'));

        this.addToScene(new THREE.AmbientLight(0x404040, 0.2));// soft white light

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(3, 10, 10);
        var d = 3;
        dirLight.castShadow = true;
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;
        dirLight.shadowCameraVisible = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 50;
        this.addToScene(dirLight);

        const helper = new THREE.CameraHelper(dirLight.shadow.camera);
        this.addToScene(helper);


        this.sceneLeave();
    }

    sceneEnter() {
        this.orbitControls.enabled = true;
        this.gameShopTitle.style.display = "flex";
    }

    sceneLeave() {
        this.orbitControls.enabled = false;
        this.gameShopTitle.style.display = "none";
    }

    loadModels() {

        this.enemy = new Enemy(allEnemiesData[0], [], this);
        this.add(this.enemy)
        this.addToBeBeUpdated(this.enemy.healthbar);
        // this.enemy.die();
        setTimeout(() => {
            this.enemy.die();
        }, 1000);

        // for (let i = 0; i < allTurretData.length * 2; i++) {

        //     const geometry = new THREE.BoxGeometry();
        //     const material = new THREE.MeshLambertMaterial({ color: 0x83aafb });
        //     const cube = new THREE.Mesh(geometry, material);
        //     cube.position.set(i * GridSize, -0.5, 0);
        //     cube.scale.set(GridSize, 1, GridSize);

        //     this.addToScene(cube);
        // }
    }

    removeEnemy() {
        this.remove(this.enemy);
    }

    removeEnemyFromAllEnemies() {

    }
}