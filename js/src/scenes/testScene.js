class TestScene extends Scene {
    constructor(scene, camera) {
        super(scene, camera);

        this.gameShopTitle = document.getElementById("game-shop-title-container");

        document.getElementById("leaveShopButton").addEventListener("click", (event) => {
            changeScene(gameScene);
        })

        this.orbitControls = new OrbitControls(this.camera, document.getElementById('app'));

        this.addToScene(new THREE.AmbientLight(0x404040, 0.2));// soft white light

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(3, 10, 10);
        var d = 3;
        dirLight.castShadow = true;
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;
        dirLight.shadowCameraVisible = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 50;
        this.addToScene(dirLight);

        const helper = new THREE.CameraHelper(dirLight.shadow.camera);
        this.addToScene(helper);


        this.sceneLeave();
    }

    sceneEnter() {
        this.orbitControls.enabled = true;
        this.gameShopTitle.style.display = "flex";
    }

    sceneLeave() {
        this.orbitControls.enabled = false;
        this.gameShopTitle.style.display = "none";
    }

    update(deltatime) {
        super.update(deltatime)

        if (this.cube) {
            this.elapsedTime += deltatime * 0.5;
            this.cube.material.uniforms.time.value = this.elapsedTime;
        }
    }

    loadModels() {
        var uniforms = {
            color: { type: 'vec3', value: new THREE.Color(0xeb0909) },
            opacity: { type: 'float', value: 0.5 },
            time: { type: 'float', value: 0 },
        }

        this.elapsedTime = 0;

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: _fragmentShader(),
            vertexShader: _vertexShader(),
        });

        material.transparent = true;
        material.side = THREE.DoubleSide;
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.receiveShadow = true;
        this.addToScene(this.cube);

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

                    gl_FragColor = vec4(outColor, opacity * mask);
                }
            `
        }
    }

    removeEnemy() {
        this.remove(this.enemy);
    }

    removeEnemyFromAllEnemies() {

    }
}