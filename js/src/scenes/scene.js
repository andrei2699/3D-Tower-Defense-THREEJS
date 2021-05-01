class Scene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.gameobjects = [];
        this.eventListeners = {};
        this.raycaster = new THREE.Raycaster();
    }

    sceneEnter() {
    }

    sceneLeave() {
    }

    update(deltaTime) {
        if (!isFocused) {
            return;
        }

        this.gameobjects.forEach(gameobject => {
            gameobject.update(deltaTime);
        });
    }

    raycastFromCamera(recursive) {
        if (!recursive) {
            recursive = false;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.intersectObjects(this.scene.children, recursive);
    }


    add(gameobject) {
        this.gameobjects.push(gameobject);
        this.scene.add(gameobject.mesh);
    }

    addToBeBeUpdated(gameobject) {
        this.gameobjects.push(gameobject);
    }

    addToScene(obj) {
        this.scene.add(obj);
    }

    remove(gameobject) {
        if (!gameobject) {
            return;
        }

        var index = this.gameobjects.indexOf(gameobject);
        if (index > -1) {
            this.gameobjects.splice(index, 1);
        }

        this.scene.remove(gameobject.mesh);
    }

    removeAll() {
        this.scene.children = [];
        this.gameobjects = [];
    }

    addEventListener(type, handler) {
        this.eventListeners[type] = handler;
    }

    _loadFoliage(map) {

        function getModelsPaths(assetNames, type) {
            var paths = [];
            assetNames.forEach(name => {
                paths.push(`assets/models/foliage/${type}/${name}.json`);
            });
            return paths;
        }

        var me = this;
        function setFoliage() {

            for (let x = 0; x < map.map.length; x++) {
                for (let y = 0; y < map.map[x].length; y++) {
                    if (map.map[x][y] >= 0) {
                        continue;
                    }

                    const randomIndex = parseInt(Math.random() * foliageModels.length);
                    const model = foliageModels[randomIndex].scene.clone();
                    model.traverse(function (object) {
                        if (object.isMesh) {
                            object.castShadow = true;
                        }
                    });
                    model.position.set(x, 0.5, y);
                    model.castShadow = true;
                    me.addToScene(model);
                }
            }
        }

        var assetNames = []
        if (map.type == "desert") {
            assetNames = ["cactus_short", "cactus_tall", "tree_palm", "tree_palmBend", "tree_palmDetailedShort", "tree_palmDetailedTall", "tree_palmShort", "tree_palmTall"];
        } else if (map.type == "mountain") {
            assetNames = ["tree_pineDefaultA", "tree_pineGroundA", "tree_pineGroundB", "tree_pineSmallB", "tree_pineSmallC", "tree_pineSmallC", "tree_pineTallA", "tree_pineTallB", "tree_pineTallC", "tree_pineTallD"];
        } else { // plains
            assetNames = ["tree_fat", "tree_oak", "tree_plateau", "tree_simple", "tree_small", "tree_tall", "tree_thin"];
        }

        var foliageModels = [];

        const paths = getModelsPaths(assetNames, map.type);

        var modelsCount = paths.length;
        var currentModelCount = 0;

        paths.forEach(path => {
            loader.load(path, function (model) {
                foliageModels.push(model);

                currentModelCount++;
                if (currentModelCount == modelsCount) {
                    setFoliage()

                }
            }, undefined, function (error) {
                console.error(error);
            });

        });
    }
}