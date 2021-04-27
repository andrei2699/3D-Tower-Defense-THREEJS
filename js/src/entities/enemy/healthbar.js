class Healthbar extends Entity {
    constructor(camera) {
        super(undefined);

        this.camera = camera;
        var uniforms = {
            lowHealthColor: { type: 'vec3', value: new THREE.Color(0xff0000) },
            fullHealthColor: { type: 'vec3', value: new THREE.Color(0x00ff00) },
            healthPercent: { type: 'float', value: 0 }
        }

        var geometry = new THREE.PlaneGeometry(1, 0.2, 1, 1);
        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: this._fragmentShader(),
            vertexShader: this._vertexShader(),
        })
        this.mesh = new THREE.Mesh(geometry, this._material);
    }

    update(deltaTime) {
        this.mesh.lookAt(this.camera.position);
    }

    updateHealth(healthPercentage) {
        this._material.uniforms.healthPercent.value = healthPercentage;
    }

    _vertexShader() {
        return `
            varying vec2 vUv; 

            void main() 
            {
                vUv = uv; 

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
            }
        `
    }

    _fragmentShader() {
        return `
            uniform vec3 lowHealthColor;
            uniform vec3 fullHealthColor;
            uniform float healthPercent;

            const vec3 bgColor = vec3(0,0,0);

            varying vec2 vUv;
    
            void main() 
            {
                vec3 healtBarColor = mix(lowHealthColor, fullHealthColor, healthPercent);
                float healthBarMask = (healthPercent > vUv.x) ? 1.0 : 0.0; 
                vec3 outColor = mix(bgColor, healtBarColor, healthBarMask);
                
                gl_FragColor = vec4(outColor, 1.0);
            }
        `
    }
}