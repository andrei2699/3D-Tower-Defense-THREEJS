const startPointColor = 0x34c92c;
const endPointColor = 0xeb0909;

function loadMap(mapData, scene, gridSize) {

    if (!gridSize) {
        gridSize = 1;
    }

    var waypoints = [];

    for (let x = 0; x < mapData.map.length; x++) {
        for (let y = 0; y < mapData.map[x].length; y++) {
            var color;
            var isPath;

            if (mapData.map[x][y] == 0) {
                color = 0x1b630b;
                isPath = false;
            }
            else if (mapData.map[x][y] > 0) {

                if (mapData.map[x][y] == 2) {
                    color = startPointColor;
                }
                else if (mapData.map[x][y] == 3) {
                    color = endPointColor;
                } else {
                    color = 0x695b17;
                }
                waypoints.push({ x: x * gridSize, y: y * gridSize });
                isPath = true;
            }
            const cell = createCell({ color: color, x: x * gridSize, y: y * gridSize })
            cell.scale.set(gridSize, 1, gridSize);
            cell.isMapCell = true;
            cell.isPath = isPath;

            // cell.addEventListener("click", (event) => {
            //     console.log(event)
            //     event.stopPropagation();
            //     const clickedCell = event.target;
            //     const coords = { x: camera.position.x, y: camera.position.z };
            //     new TWEEN.Tween(coords)
            //         .to({ x: clickedCell.position.x, y: clickedCell.position.z })
            //         .easing(TWEEN.Easing.Quadratic.Out)
            //         .onUpdate(() =>
            //             camera.position.set(coords.x, camera.position.y, coords.y)
            //         )
            //         .start();
            // });
            // interactionManager.add(cell);
            scene.add(cell);
        }
    }

    return waypoints;
}

function createCell({ color, x, y }) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 0, y);
    cube.receiveShadow = true;

    return cube;
}