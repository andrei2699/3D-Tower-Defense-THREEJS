class MainMenuScene extends Scene {
    constructor(scene, camera) {
        super(scene, camera);

        this.mainMenu = document.getElementById("main-menu-container");

        this.orbitControls = new OrbitControls(this.camera, document.getElementById('app'));
        this.orbitControls.mouseMovementPan({ clientX: -window.innerWidth / 8, clientY: -window.innerHeight / 4 })
        this.orbitControls.enabled = false;

        document.getElementById("playButton").addEventListener("click", (event) => {
            gameScene.setMap('assets/levels/level1.json')
            changeScene(gameScene);
        })

        document.getElementById("tutorialButton").addEventListener("click", (event) => {
            console.log("Tutorial");
        })

        var me = this;
        var loader = new THREE.FileLoader();
        loader.load(
            'assets/levels/level1.json',
            function (data) {
                const map = JSON.parse(data);
                me.waypoints = loadMap(map, me.scene, GridSize);

            },
            undefined,
            function (err) {
                console.error('An error happened');
                console.error(err)
            }
        );
    }

    sceneEnter() {
        this.mainMenu.style.display = "flex";
    }

    sceneLeave() {
        this.mainMenu.style.display = "none";
    }
}