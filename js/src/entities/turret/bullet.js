class Bullet {
    constructor(bulletData, startPosition, direction, scene) {
        this.scene = scene;

        const geometry = new THREE.SphereGeometry(bulletData.radius, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: bulletData.color });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.scene.add(this)

        this.speed = bulletData.speed;
        this.damage = bulletData.damage;
        this.targetDirection = direction;
        this.expirationTime = 2.5;
        this.elapsedTime = 0;

        this.worldPosition = new THREE.Vector3();
        this.intersectionWorldPosition = new THREE.Vector3();
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.expirationTime) {
            this.scene.remove(this);
        }

        var direction = this.targetDirection.clone();
        direction.multiplyScalar(this.speed * deltaTime);
        direction.add(this.mesh.position);
        this.mesh.position.set(direction.x, direction.y, direction.z);
        var collision = this.findCollision();

        if (collision) {

            collision.applyDamage(this.damage);
            this.scene.remove(this);
        }
    }

    findCollision() {

        this.mesh.getWorldPosition(this.worldPosition);
        for (let i = 0; i < this.scene.allEnemies.length; i++) {
            this.scene.allEnemies[i].mesh.getWorldPosition(this.intersectionWorldPosition);

            if (this.worldPosition.distanceToSquared(this.intersectionWorldPosition) <= 0.5) {

                return this.scene.allEnemies[i];
            }
        }

        return undefined;
    }
}