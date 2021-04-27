class Enemy extends AnimatedEntity {
    constructor(entityData, waypoints, scene) {
        super(entityData.mesh.scene);

        this.data = entityData.data;
        this.mesh.scale.set(entityData.data.meshSize, entityData.data.meshSize, entityData.data.meshSize);

        this.speed = entityData.data.speed;
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;

        this.parentScene = scene;

        this.mesh.isEnemy = true;

        this.mesh.castShadow = true;
        this.mesh.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });

        this.health = entityData.data.health;
        this.maxHealth = entityData.data.health;
        this.healthbar = new Healthbar(scene.camera);
        this.mesh.add(this.healthbar.mesh);

        this.healthbar.mesh.position.set(0, this.mesh.children[0].scale.y * 2.4, 0);

        this.healthbar.updateHealth(1);

        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.clips = entityData.mesh.animations;

        this.mixer.timeScale = entityData.data.speed;
        this.mixer.clipAction(this.clips[0]).play();

        this.currentWaypointPosition = new THREE.Vector3();
        this.enemyWorldPosition = new THREE.Vector3();

        if (this.waypoints.length > 0) {
            this.mesh.position.set(this.waypoints[0].x, 0.52, this.waypoints[0].y)
        }

        if (entityData.data.color) {
            var first = 0;

            this.mesh.traverse(function (object) {
                if (object.isMesh && object.material.color) {
                    first++;
                    if (first == 1) {
                        object.material.color = new THREE.Color(entityData.data.color);
                    }
                }
            });
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.mixer.update(deltaTime)

        if (this.currentWaypointIndex >= this.waypoints.length) {
            return;
        }

        this.currentWaypointPosition.set(this.waypoints[this.currentWaypointIndex].x, 0.52, this.waypoints[this.currentWaypointIndex].y)
        if (this.mesh.position.distanceTo(this.currentWaypointPosition) < 0.1) {

            this.currentWaypointIndex++;
            if (this.currentWaypointIndex >= this.waypoints.length) {
                this.die();
                return;
            }
        }

        var direction = this.currentWaypointPosition.sub(this.mesh.position);
        direction.normalize();
        direction.multiplyScalar(this.speed * deltaTime);
        direction.add(this.mesh.position);
        this.mesh.position.set(direction.x, direction.y, direction.z);


        this.currentWaypointPosition.set(this.waypoints[this.currentWaypointIndex].x, 0.52, this.waypoints[this.currentWaypointIndex].y)
        this.mesh.getWorldPosition(this.enemyWorldPosition);
        this.currentWaypointPosition.sub(this.enemyWorldPosition);
        this.currentWaypointPosition.normalize();
        var angle = Math.atan2(this.currentWaypointPosition.x, this.currentWaypointPosition.z);
        this.mesh.rotation.set(0, angle, 0);
    }

    applyDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        this.healthbar.updateHealth(this.health / this.maxHealth);
    }

    die() {
        this.parentScene.removeEnemy(this, this.health > 0);
    }

    // startMovementTo(targetCoords) {
    //     const coords = { x: this.mesh.position.x, y: this.mesh.position.y };
    //     new TWEEN.Tween(coords)
    //         .to({ x: targetCoords.x, y: targetCoords.y })
    //         .onUpdate(() =>
    //             this.mesh.position.set(coords.x, this.mesh.position.y, coords.y)
    //         )
    //         .start();
    // }
}