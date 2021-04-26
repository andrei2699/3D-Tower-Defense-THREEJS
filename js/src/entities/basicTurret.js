class BasicTurret extends Entity {
    constructor(entityData) {
        super(entityData.mesh.scene);

        this.mesh.isTurret = true;
        this.mesh.component = this;

        this.firingSpeed = entityData.data.firingSpeed;
        this.currentFiringTime = 0;
        this.bulletDamage = entityData.data.bulletDamage;

        this.weapon = undefined;
        for (let i = 0; i < this.mesh.children.length; i++) {
            if (this.mesh.children[i].userData && this.mesh.children[i].userData.name.toLowerCase() == "weapon") {
                this.weapon = this.mesh.children[i];
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
    }

    update(deltaTime) {
        super.update(deltaTime);

        this.currentFiringTime += deltaTime;
        if (this.currentFiringTime >= this.firingSpeed) {
            this.currentFiringTime = 0;
            this.shoot();
        }
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

        new BasicBullet(10, this.bulletDamage, barrelWorldPos, barrelDirection);
    }
}