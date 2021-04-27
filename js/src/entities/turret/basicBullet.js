class BasicBullet {
    constructor(speed, damage, startPosition, direction) {
        this.radius = 0.05;

        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.set(startPosition.x, startPosition.y, startPosition.z);
        currentScene.add(this)

        this.speed = speed;
        this.targetDirection = direction;
        this.expirationTime = 2.5;
        this.elapsedTime = 0;
        this.damage = damage;
    }

    update(deltaTime) {

        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.expirationTime) {
            currentScene.remove(this);
        }

        var direction = this.targetDirection.clone();
        direction.multiplyScalar(this.speed * deltaTime);
        direction.add(this.mesh.position);
        this.mesh.position.set(direction.x, direction.y, direction.z);
    }
}