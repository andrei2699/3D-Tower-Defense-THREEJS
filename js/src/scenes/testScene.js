class TestScene extends Scene {
    constructor(scene, camera) {
        super(scene, camera);

        this.gameShopTitle = document.getElementById("game-shop-title-container");

        document.getElementById("leaveShopButton").addEventListener("click", (event) => {
            changeScene(gameScene);
        })

        this.orbitControls = new OrbitControls(this.camera, document.getElementById('app'));
        this.orbitControls.mouseMovementPan({ clientX: -window.innerWidth / 8, clientY: -window.innerHeight / 4 })

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
        for (let i = 0; i < allTurretData.length * 4; i++) {

            var turret = new Turret(allTurretData[0], this);
            this.add(turret);

            turret.mesh.position.set(i * GridSize * 4, 0, i * GridSize * 4);
        }

        // for (let i = 0; i < allTurretData.length * 2; i++) {

        //     const geometry = new THREE.BoxGeometry();
        //     const material = new THREE.MeshLambertMaterial({ color: 0x83aafb });
        //     const cube = new THREE.Mesh(geometry, material);
        //     cube.position.set(i * GridSize, -0.5, 0);
        //     cube.scale.set(GridSize, 1, GridSize);

        //     this.addToScene(cube);
        // }
    }
}