THREE.Cache.enabled = true;
var cameraTargetPosition;

document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("pointerdown", onDocumentMouseDown, false);
document.addEventListener("keydown", onKeyDown, false);

var musicWasPlaying;
var isFocused = true;

window.onfocus = function () {
    isFocused = true;
    setMusicPlaying(musicWasPlaying)
}

window.onblur = function () {
    isFocused = false;
    musicWasPlaying = isPlayingMusic;
    setMusicPlaying(false)
}

const GridSize = 1;
var soundEffectsVolume = 1;
var isPlayingMusic = true;

var allTurretData = [];
var allEnemiesData = [];

var allSoundsBuffers = {};
var audioLoader = new THREE.AudioLoader();
var musicSound;

const audioListener = new THREE.AudioListener();
const renderer = createRenderer();

var gameScene = new GameScene(createScene(), createCamera());

var mainMenuScene = new MainMenuScene(createScene(), createCamera());
mainMenuScene.addToScene(createLight());

var currentScene;
// changeScene(gameScene);
// gameScene.setMap('assets/levels/level1.json')

changeScene(mainMenuScene);

loadModels(() => {
    console.log("objects loaded")
    mainMenuScene.loadModels();
    gameScene.loadModels();
});

audioLoader.load('assets/sounds/music/Upbeat Forever.mp3', function (buffer) {
    console.log("Music Loaded");
    musicSound = new THREE.Audio(audioListener);
    musicSound.setBuffer(buffer);
    musicSound.setLoop(true);
    musicSound.setVolume(0.5);
    if (isFocused) {
        musicSound.play();
    }
});


animate((time) => {
    renderer.render(currentScene.scene, currentScene.camera);
});

function onDocumentMouseMove(event) {
    if (currentScene.eventListeners["mousemove"]) {
        currentScene.eventListeners["mousemove"](event);
    }
}

function onDocumentMouseDown(event) {
    if (currentScene.eventListeners["pointerdown"]) {
        currentScene.eventListeners["pointerdown"](event);
    }
}

function onKeyDown(event) {
    if (currentScene.eventListeners["keydown"]) {
        currentScene.eventListeners["keydown"](event);
    }
}

function changeScene(scene) {
    if (currentScene) {
        currentScene.sceneLeave();
    }
    currentScene = scene;
    currentScene.sceneEnter();
}

function toggleMusicPlay() {
    setMusicPlaying(!isPlayingMusic)
}

function setMusicPlaying(playing) {
    if (!musicSound) {
        return
    }
    isPlayingMusic = playing;
    if (isPlayingMusic) {
        musicSound.play();
    } else {
        musicSound.pause();
    }
}

function playSoundEffect(soundBuffer, loop = false) {

    if (currentScene == mainMenuScene) {
        return;
    }

    if (soundEffectsVolume > 0) {
        var sound = new THREE.Audio(audioListener);
        sound.setBuffer(soundBuffer);
        sound.setLoop(loop);
        sound.setVolume(soundEffectsVolume * 0.5);
        sound.play();
    }
}

function loadModels(onAllModelsLoaded) {
    loader = new THREE.GLTFLoader();

    var assetsCount = audioData.length;
    currentCount = 0;

    audioData.forEach(data => {
        audioLoader.load(data.path, function (buffer) {
            allSoundsBuffers[data.name] = buffer;

            currentCount++;
            if (currentCount == assetsCount) {
                loadMeshes();
            }
        });
    });

    function loadMeshes() {
        assetsCount = turretData.length + enemiesData.length;
        currentCount = 0;

        var assets = {};

        loadEntityData(turretData, allTurretData);
        loadEntityData(enemiesData, allEnemiesData);

        function loadEntityData(array, otherArray) {
            array.forEach(data => {
                if (assets[data.assetPath]) {
                    addData(otherArray, data, assets[data.assetPath]);
                }
                else {
                    loader.load(data.assetPath, function (model) {
                        assets[data.assetPath] = model;
                        addData(otherArray, data, model);

                    }, undefined, function (error) {
                        console.error(error);
                    });
                }
            });
        }

        function addData(vector, data, model) {
            var effects = {};
            data.soundEffects.forEach(element => {
                effects[element.action] = allSoundsBuffers[element.name];
            });

            vector.push(new EntityData(data, model, effects));
            currentCount++;
            if (currentCount == assetsCount) {
                if (onAllModelsLoaded) {
                    onAllModelsLoaded();
                }
            }
        }
    }
}

function createRenderer() {
    const app = document.getElementById("app");
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    app.appendChild(renderer.domElement);

    renderer.gammaOutput = true
    renderer.shadowMap.enabled = true;
    return renderer;
}

function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xA0A0A0);
    return scene;
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 10;
    camera.position.y = 5;
    camera.rotation.x = -Math.PI / 4;
    return camera;
}

function createLight() {
    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 10, 10);
    return light;
}

function animate(callback) {
    var deltaTime = 0.0;
    var lastTime = 0.0;
    function loop(time) {
        callback(time);
        deltaTime = (time - lastTime) * 0.001;
        lastTime = time;

        currentScene.update(deltaTime);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

function createCube({ color, x, y }) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 1, y);

    return cube;
}