class Turret extends Entity {
    constructor(entityData) {
        super(entityData.mesh.scene);

        this.mesh.isTurret = true;
        this.mesh.component = this;

        this.firingSpeed = ntityData.data.firingSpeed;
        this.currentFiringTime = 0;
        this.bulletDamage = ntityData.data.bulletDamage;

        this.weapon = undefined;
        for (let i = 0; i < this.mesh.children.length; i++) {
            if (mesh.children[i].userData && mesh.children[i].userData.name.toLowerCase() == "weapon") {
                this.weapon = mesh.children[i];
                break;
            }
        }

        this.barrels = [];
        this.weapon.children.forEach(child => {
            if (child.name.includes("barrel")) {
                this.barrels.push(child);
            }
        });
        this.selectedBarrelToShootIndex = 0;

        const reachOffset = 0.5;
        this.reachDistance = ntityData.data.reachDistance + reachOffset;

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
            ntityData.data.reachDistance, ntityData.data.reachDistance,           // xRadius, yRadius
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

        // scene.add(this.reachEllipse);
    }

    update(deltaTime) {
        super.update(deltaTime);

        this.currentFiringTime += deltaTime;
        if (this.currentFiringTime >= this.firingSpeed) {
            this.currentFiringTime = 0;
            this.shoot();
        } return

        if (this.targetedEnemy) {
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
        }
        else {
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

            this.targetedEnemy = this.findTargetMesh();
        }

        this.reachEllipse.position.set(this.mesh.position.x, this.mesh.position.y + this.mesh.scale.y / 2, this.mesh.position.z);
    }

    place() {
        this.setReachRadiusVisibility(false);
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

        new Bullet(10, this.bulletDamage, barrelWorldPos, barrelDirection);
    }

    findTargetMesh() {
        if (this.targetedEnemy) {
            return this.targetedEnemy;
        }

        this.mesh.getWorldPosition(this.turretWorldPosition);

        for (let i = 0; i < allEnemies.length; i++) {
            allEnemies[i].mesh.getWorldPosition(this.targetEnemyWorldPosition);

            if (this.turretWorldPosition.distanceToSquared(this.targetEnemyWorldPosition) <= this.reachDistance * this.reachDistance) {

                return allEnemies[i].mesh;

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
}