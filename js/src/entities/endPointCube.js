class EndPointCube extends Entity {
    constructor(position, color, direction) {
        super(undefined);

        this.increment = direction * 0.5;

        var uniforms = {
            color: { type: 'vec3', value: new THREE.Color(color) },
            opacity: { type: 'float', value: 0.5 },
            time: { type: 'float', value: 0 },
        }

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: _fragmentShader(),
            vertexShader: _vertexShader(),
        });

        material.transparent = true;
        material.side = THREE.DoubleSide;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y, position.z);

        function _vertexShader() {
            return `
                    varying vec2 vUv; 
                    varying vec3 vPosition; 
        
                    void main() 
                    {
                        vPosition = position;
                        vUv = uv; 
        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
                    }
                `
        }

        function _fragmentShader() {
            return `
                    uniform vec3 color;
                    uniform float opacity;
                    uniform float time;
        
                    varying vec2 vUv;
                    varying vec3 vPosition;
            
                    void main() 
                    {
                        if (vPosition.y > 0.3 || vPosition.y < -0.3){
                            discard;
                        }
        
                        float fracTime = fract(time);                    
        
                        vec3 white = vec3(1.0, 1.0, 1.0);
        
                        float mask = fract((vUv.y - time ) * 4.0);
                        vec3 outColor = color * mask;
        
                        gl_FragColor = vec4(outColor, opacity * mask-0.1);
                    }
                `;
        }

        this.elapsedTime = 0.0;
    }

    update(deltaTime) {
        super.update(deltaTime);

        this.elapsedTime += deltaTime * this.increment;

        this.mesh.material.uniforms.time.value = this.elapsedTime;

    }
}