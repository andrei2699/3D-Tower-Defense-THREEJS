class MainMenuScene extends Scene {
    constructor(scene, camera) {
        super(scene, camera);

        this.mainMenu = document.getElementById("main-menu-container");
        this.tutorialPanel = document.getElementById("tutorial-panel");
        this.tutorialPanelVisible = false;

        this.orbitControls = new OrbitControls(this.camera, document.getElementById('app'));
        this.orbitControls.mouseMovementPan({ clientX: -window.innerWidth / 8, clientY: -window.innerHeight / 4 })
        this.orbitControls.enabled = false;

        document.getElementById("playButton").addEventListener("click", (event) => {
            gameScene.setMap('assets/levels/level1.json')
            changeScene(gameScene);
        })

        document.getElementById("tutorialButton").addEventListener("click", (event) => {
            this.setTutorialPanelVisibility(!this.tutorialPanelVisible);
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
        this.setTutorialPanelVisibility(false);
    }

    sceneEnter() {
        this.mainMenu.style.display = "flex";
        this.setTutorialPanelVisibility(false);
    }

    sceneLeave() {
        this.mainMenu.style.display = "none";
        this.setTutorialPanelVisibility(false);
    }

    setTutorialPanelVisibility(visible) {
        this.tutorialPanelVisible = visible;
        this.tutorialPanel.style.display = visible ? "flex" : "none";
    }
}