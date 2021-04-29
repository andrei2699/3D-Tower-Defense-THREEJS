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

    addEventListener(type, handler) {
        this.eventListeners[type] = handler;
    }
}