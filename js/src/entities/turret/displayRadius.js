class DisplayRadius {
    constructor(reachDistance, startAngle, endAngle) {
        const curve = new THREE.EllipseCurve(
            0, 0,
            reachDistance, reachDistance,
            startAngle, endAngle,
            false,
            0
        );


        this.normalColor = new THREE.Color(0, 2, 0.5);
        this.errorColor = new THREE.Color(2, 0, 0);

        const points = curve.getPoints(50);
        const ringGeometry = new THREE.BufferGeometry().setFromPoints(points);
        this._ringMaterial = new THREE.LineBasicMaterial({ color: this.normalColor });
        this.reachEllipseRing = new THREE.Line(ringGeometry, this._ringMaterial);
        this.reachEllipseRing.ignoreRaycast = true;


        const geometry = new THREE.PlaneGeometry(reachDistance * 2, reachDistance * 2);
        var uniforms = {
            radius: { type: 'float', value: reachDistance },
            radiusColor: { type: 'vec3', value: this.normalColor }
        }
        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: this._fragmentShader(),
            vertexShader: this._vertexShader(),
        })

        this._material.transparent = true;
        this.reachEllipse = new THREE.Mesh(geometry, this._material);
        this.reachEllipse.ignoreRaycast = true;
    }

    setVisibility(visible) {
        this.reachEllipse.visible = visible;
        this.reachEllipseRing.visible = visible;
    }

    setPosition(x, y, z) {
        this.reachEllipse.position.set(x, y, z);
        this.reachEllipseRing.position.set(x, y, z);
    }

    setQuaternion(quat) {
        this.reachEllipse.setRotationFromQuaternion(quat.conjugate());
        this.reachEllipseRing.setRotationFromQuaternion(quat);
    }

    updateColor(error) {
        this._material.uniforms.radiusColor.value = error ? this.errorColor : this.normalColor;
        this._ringMaterial.color = error ? this.errorColor : this.normalColor;
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
            uniform float radius;
            uniform vec3 radiusColor;

            varying vec2 vUv;            

            void main() 
            {
                float distanceToCenter = distance(vUv, vec2(0.5));
                float invertedDistanceToCenter = 1.0 - distanceToCenter;
                float circularMask = step(distanceToCenter, 0.5);
                float mask = circularMask - invertedDistanceToCenter;

                gl_FragColor = vec4(radiusColor * mask, mask - 0.3);
            }
        `
    }
}