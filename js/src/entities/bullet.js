class Bullet extends BasicBullet {
    constructor(speed, damage, startPosition, direction) {
        super(speed, damage, startPosition, direction);

        this.worldPosition = new THREE.Vector3();
        this.intersectionWorldPosition = new THREE.Vector3();
    }

    update(deltaTime) {
        super.update(deltaTime);

        var collision = this.findCollision();
        if (collision) {

            collision.applyDamage(this.damage);
            removeGameobject(this);
        }
    }

    findCollision() {

        this.mesh.getWorldPosition(this.worldPosition);
        for (let i = 0; i < allEnemies.length; i++) {
            allEnemies[i].mesh.getWorldPosition(this.intersectionWorldPosition);

            if (this.worldPosition.distanceToSquared(this.intersectionWorldPosition) <= 0.1) {

                return allEnemies[i];
            }
        }

        return undefined;
    }
}