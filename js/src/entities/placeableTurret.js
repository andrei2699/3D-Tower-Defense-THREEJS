class PlaceableTurret extends Entity {
    constructor(entityData) {
        super(entityData.mesh.scene);

        this.data = entityData
        this.mesh.isTurret = true;
        this.mesh.component = this;

        this.weapon = undefined;
        for (let i = 0; i < this.mesh.children.length; i++) {
            if (this.mesh.children[i].userData && this.mesh.children[i].userData.name.toLowerCase() == "weapon") {
                this.weapon = this.mesh.children[i];
                break;
            }
        }

        this.mesh.castShadow = true;
        this.mesh.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });


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

        // scene.add(this.reachEllipse);
    }

    update(deltaTime) {
        super.update(deltaTime);

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

        this.reachEllipse.position.set(this.mesh.position.x, this.mesh.position.y + this.mesh.scale.y / 2, this.mesh.position.z);
    }

    place() {
        this.setReachRadiusVisibility(false);
    }

    setMaterialColor(color) {
        var first = 0;

        this.mesh.traverse(function (object) {
            if (object.isMesh && object.material.color) {
                first++;
                if (first == 1) {
                    object.material.color = new THREE.Color(color);
                }
            }
        });
    }

    setReachRadiusVisibility(visible) {
        this.reachEllipse.visible = visible;
    }
}