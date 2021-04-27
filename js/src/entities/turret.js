class Turret extends Entity {
    constructor(entityData, scene) {
        super(entityData.mesh.scene.clone());

        this.scene = scene;
        this.mesh.isTurret = true;
        this.mesh.component = this;

        this.firingSpeed = entityData.data.firingSpeed;
        this.currentFiringTime = 0;
        this.bulletDamage = entityData.data.bulletDamage;
        this.isPlaced = false;

        this.weapon = undefined;
        for (let i = 0; i < this.mesh.children.length; i++) {
            if (this.mesh.children[i].userData && this.mesh.children[i].userData.name.toLowerCase() == "weapon") {
                this.weapon = this.mesh.children[i];
                break;
            }
        }

        for (let i = 0; i < this.mesh.children.length; i++) {
            this.mesh.children[i].material = this.mesh.children[i].material.clone();
        }
        this.setMaterialColor(0xffffff);

        this.mesh.castShadow = true;
        this.mesh.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });


        this.barrels = [];
        this.weapon.children.forEach(child => {
            if (child.name.includes("barrel")) {
                this.barrels.push(child);
            }
        });
        this.selectedBarrelToShootIndex = 0;

        const reachOffset = 0.5;
        this.reachDistance = entityData.data.reachDistance + reachOffset;

        this.turretWorldPosition = new THREE.Vector3();

        this.targetedEnemy = undefined;
        this.targetEnemyWorldPosition = new THREE.Vector3();

        this.weaponEuler = new THREE.Euler();
        this.weaponAngle = 0;
        this.weaponRotateDirection = 1;
        this.weaponRotationMinAngle = 0;
        this.weaponRotationMaxAngle = Math.PI * 2;
        this.rotationAngle = 0;

        const curve = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            entityData.data.reachDistance, entityData.data.reachDistance,           // xRadius, yRadius
            this.weaponRotationMinAngle, this.weaponRotationMaxAngle,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );

        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        this.reachEllipse = new THREE.Line(geometry, material);
        this.reachEllipse.setRotationFromQuaternion(this.weapon.quaternion);
        this.reachEllipseEuler = new THREE.Euler();
        this.reachEllipse.ignoreRaycast = true;
        this.reachEllipse.position.set(this.mesh.position.x, this.mesh.position.y + this.mesh.scale.y / 2, this.mesh.position.z);
        this.mesh.add(this.reachEllipse);
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (this.isPlaced && this.targetedEnemy) {
            this.currentFiringTime += deltaTime;
            if (this.currentFiringTime >= this.firingSpeed) {
                this.currentFiringTime = 0;
                this.shoot();
            }

            this.targetedEnemy.getWorldPosition(this.targetEnemyWorldPosition);
            this.mesh.getWorldPosition(this.turretWorldPosition);
            var distance = this.turretWorldPosition.distanceTo(this.targetEnemyWorldPosition);

            this.targetEnemyWorldPosition.sub(this.turretWorldPosition);
            this.targetEnemyWorldPosition.normalize();

            var angle = Math.atan2(this.targetEnemyWorldPosition.x, this.targetEnemyWorldPosition.z);
            this.weaponEuler.set(Math.PI / 2, 0, - angle);

            this.weapon.setRotationFromEuler(this.weaponEuler);

            if (distance > this.reachDistance) {
                this.targetedEnemy = undefined;
            }
        } else {
            this.currentFiringTime = 0;

            this.weaponAngle += deltaTime * this.weaponRotateDirection;
            if (this.weaponAngle >= this.weaponRotationMaxAngle + this.rotationAngle) {
                this.weaponRotateDirection *= -1;
                this.weaponAngle = this.weaponRotationMaxAngle + this.rotationAngle;
            }
            if (this.weaponAngle <= this.weaponRotationMinAngle + this.rotationAngle) {
                this.weaponRotateDirection *= -1;
                this.weaponAngle = this.weaponRotationMinAngle + this.rotationAngle;
            }

            this.weaponEuler.set(Math.PI / 2, 0, this.weaponAngle);
            this.weapon.setRotationFromEuler(this.weaponEuler);

            if (this.isPlaced) {
                this.targetedEnemy = this.findTargetMesh();
            }
        }
    }

    place() {
        this.isPlaced = true;
        this.setReachRadiusVisibility(false);
        this.setMaterialColor(0xffffff);
    }

    setReachRadiusVisibility(visible) {
        this.reachEllipse.visible = visible;
    }

    shoot() {
        var barrelWorldPos = new THREE.Vector3();
        this.barrels[this.selectedBarrelToShootIndex].getWorldPosition(barrelWorldPos);

        this.selectedBarrelToShootIndex++;
        if (this.selectedBarrelToShootIndex >= this.barrels.length) {
            this.selectedBarrelToShootIndex = 0;
        }

        var barrelDirection = new THREE.Vector3(0, 1, 0);
        barrelDirection.applyEuler(this.weapon.rotation);
        barrelDirection.normalize();

        new Bullet(10, this.bulletDamage, barrelWorldPos, barrelDirection, this.scene);
    }

    findTargetMesh() {
        if (this.targetedEnemy) {
            return this.targetedEnemy;
        }

        this.mesh.getWorldPosition(this.turretWorldPosition);

        for (let i = 0; i < this.scene.allEnemies.length; i++) {
            this.scene.allEnemies[i].mesh.getWorldPosition(this.targetEnemyWorldPosition);

            if (this.turretWorldPosition.distanceToSquared(this.targetEnemyWorldPosition) <= this.reachDistance * this.reachDistance) {

                return this.scene.allEnemies[i].mesh;

                // this.targetEnemyWorldPosition.sub(this.turretWorldPosition);

                // if (this._isPositionInViewRange(this.targetEnemyWorldPosition)) {
                // }
            }
        }

        return undefined;
    }

    _isPositionInViewRange(position) {
        var angle = -Math.atan2(position.x, position.z);
        if (angle < 0) {
            angle += Math.PI * 2;
        }

        return angle <= this.weaponRotationMaxAngle + this.rotationAngle &&
            angle >= this.weaponRotationMinAngle + this.rotationAngle;
    }

    setMaterialColor(color) {
        this.mesh.traverse(function (object) {
            if (object.isMesh && object.material.color) {
                object.material.color = new THREE.Color(color);
            }
        });
    }
}