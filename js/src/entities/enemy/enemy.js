class Enemy extends AnimatedEntity {
    constructor(entityData, waypoints, scene) {
        super(entityData.mesh.scene);

        this.soundEffects = entityData.effects;

        this.data = entityData.data;
        this.mesh.scale.set(entityData.data.meshSize, entityData.data.meshSize, entityData.data.meshSize);

        this.isDead = false;
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
        this._setDyingShader();
        this.elapsedTime = 0.0;
        this.spawned = true;
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (this.spawned) {
            this.elapsedTime += deltaTime * 2.0;
            var me = this;

            this.mesh.traverse(function (object) {
                if (object.isMesh && object.material.uniforms.time) {
                    object.material.uniforms.time.value = me.elapsedTime;
                }
            });

            if (this.elapsedTime >= 1.0) {
                this.elapsedTime = 1.0
                this.spawned = false;
            }

            return;
        }

        if (this.isDead) {
            this.elapsedTime -= deltaTime * 2.0;
            var me = this;

            this.mesh.traverse(function (object) {
                if (object.isMesh) {
                    object.material.uniforms.time.value = me.elapsedTime;
                }
            });

            if (this.elapsedTime <= 0.0) {
                this.parentScene.removeEnemy(this);
            }

            return;
        }

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
        this.isDead = true;

        playSoundEffect(this.soundEffects["death"])

        this._setDyingShader();

        var index = this.mesh.children.indexOf(this.healthbar.mesh);
        if (index > -1) {
            this.mesh.children.splice(index, 1);
        }

        this.parentScene.removeEnemyFromAllEnemies(this, this.health > 0);
    }

    _setDyingShader() {

        this.mesh.traverse(function (object) {
            if (object.isMesh && object.material.color) {

                var color = object.material.color;

                object.material = THREE.extendMaterial(THREE.MeshStandardMaterial, {
                    header: 'varying vec2 vUv;',
                    material: {
                        skinning: true
                    },
                    uniforms: {
                        time: 0
                    },
                    vertex: {
                        'void main() {': 'vUv=uv;'
                    },
                    fragment: {
                        '?void main()': helperFunctions(),
                        '?uniform vec3 diffuse;': 'uniform float time;',
                        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );': _frag()
                    }
                });

                object.material.uniforms.diffuse.value = color;
                object.material.skinning = true;
                object.material.side = THREE.DoubleSide;
                object.material.transparent = true;
            }
        });

        function helperFunctions() {
            return `
                const float noiseScale = 5.0;
                const float edgeOffset = 0.05;
                const vec3 edgeColor = vec3(0.5, 0.7, 0.5);

                float noise(vec2 n) {
                    const vec2 d = vec2(0.0, 1.0);
                    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
                    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
                }

                float map(float value, float min1, float max1, float min2, float max2) {
                    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                }
                `;
        }

        function _frag() {
            return `           
                    float noiseValue = noise(vUv * noiseScale);                    
                    float mask = step(noiseValue, time);
                    float edgesMask = step(noiseValue, time + edgeOffset);
                    float diff = clamp(edgesMask - mask, 0.0, 1.0);

                    gl_FragColor = vec4(gl_FragColor.rgb * mask + edgeColor * diff, mask + edgesMask);
                `;
        }
    }
}