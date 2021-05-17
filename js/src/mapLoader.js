const startPointColor = 0x34c92c;
const endPointColor = 0xeb0909;

function loadMap(mapData, scene, gridSize) {

    if (!gridSize) {
        gridSize = 1;
    }

    var startPos = { x: 0, y: 0 };

    for (let x = 0; x < mapData.mapsize; x++) {
        for (let y = 0; y < mapData.map[x].length; y++) {
            var color;
            var isPath;

            if (mapData.map[x][y] == 0 || mapData.map[x][y] < 0) {
                color = 0x1b630b;
                isPath = false;
            }
            else if (mapData.map[x][y] > 0) {
                if (mapData.map[x][y] == 2) {
                    color = startPointColor;
                    startPos = { x: x, y: y };
                }
                else if (mapData.map[x][y] == 3) {
                    color = endPointColor;
                } else {
                    color = 0x695b17;
                }
                isPath = true;
            }
            const cell = createCell({ color: color, x: x * gridSize, y: y * gridSize })
            cell.scale.set(gridSize, 1, gridSize);
            cell.isMapCell = true;
            cell.isPath = isPath;

            scene.add(cell);
        }
    }

    var waypoints = [];
    var count = 0;

    waypoints.push({ x: startPos.x * gridSize, y: startPos.y * gridSize });

    while (mapData.map[startPos.x][startPos.y] != 3) {

        if (!hasWaypoint(waypoints, startPos.x + 1, startPos.y) && inMap(startPos.x + 1, startPos.y, mapData.mapsize) && mapData.map[startPos.x + 1][startPos.y] > 0) {
            startPos.x++;
        }
        else if (!hasWaypoint(waypoints, startPos.x - 1, startPos.y) && inMap(startPos.x - 1, startPos.y, mapData.mapsize) && mapData.map[startPos.x - 1][startPos.y] > 0) {
            startPos.x--;
        }
        else if (!hasWaypoint(waypoints, startPos.x, startPos.y - 1) && inMap(startPos.x, startPos.y - 1, mapData.mapsize) && mapData.map[startPos.x][startPos.y - 1] > 0) {
            startPos.y--;
        }
        else if (!hasWaypoint(waypoints, startPos.x, startPos.y + 1) && inMap(startPos.x, startPos.y + 1, mapData.mapsize) && mapData.map[startPos.x][startPos.y + 1] > 0) {
            startPos.y++;
        }
        waypoints.push({ x: startPos.x * gridSize, y: startPos.y * gridSize });

        count++;
        if (count > mapData.mapsize * mapData.mapsize) {
            break;
        }
    }

    return waypoints;
}

function hasWaypoint(waypoints, x, y) {
    for (let i = 0; i < waypoints.length; i++) {
        const element = waypoints[i];
        if (element.x == x && element.y == y) {
            return true;
        }
    }
    return false;
}

function inMap(x, y, size) {
    return x >= 0 && y >= 0 && x < size && y < size;
}

function createCell({ color, x, y }) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 0, y);
    cube.receiveShadow = true;

    return cube;
}