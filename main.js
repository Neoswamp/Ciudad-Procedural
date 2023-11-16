const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


scene.background = new THREE.CubeTextureLoader()
    .setPath('assets/skybox/')
    .load([
        'corona_lf.png',
        'corona_rt.png',
        'corona_up.png',
        'corona_dn.png',
        'corona_ft.png',
        'corona_bk.png'
    ]);

var k = 15;
var l = k / 2;
var matrizA = new Array(k);
var matrizB = new Array(k);
var matrizC = new Array(k);

for (var i = 0; i < k; i++) {
    matrizA[i] = new Array(k);
    for (var j = 0; j < k; j++) {
        var r = Math.random();
        if (j % 2 == 0 && i % 2 == 0 && r <= 0.2) {
            matrizA[i][j] = 1
        }
        else {
            matrizA[i][j] = 0
        }
    }
}

for (var i = 0; i < k; i++) {
    matrizB[i] = new Array(k);
    for (var j = 0; j < k; j++) {
        matrizB[i][j] = 0
    }
}

for (var i = 0; i < k; i++) {
    matrizC[i] = new Array(k);
    for (var j = 0; j < k; j++) {
        matrizC[i][j] = 0
    }
}

for (var i = 0; i < k; i++) {
    for (var j = 0; j < k; j++) {
        if (matrizA[i][j] == 1) {
            var tipo = Math.floor(Math.random() * 4)
            switch (tipo) {
                case 0:
                    for (var i2 = i; i2 < k; i2++) {
                        matrizB[i2][j] = 0
                    }
                    matrizC[i][j] = tipo
                    break
                case 1:
                    for (var j2 = j; j2 < k; j2++) {
                        matrizB[i][j2] = 1
                    }
                    for (var i2 = 0; i2 < k; i2++) {
                        matrizB[i2][j] = 1
                    }
                    matrizC[i][j] = tipo
                    break;
            }
        }
    }
}

const buildingTextures = [
    'assets/textures/edificio.jpg',
    'assets/textures/edificio2.jpg',
    'assets/textures/edificio3.jpg',
    'assets/textures/edificio4.jpg'
];

for (var i = 1; i < k - 1; i++) {
    for (var j = 1; j < k - 1; j++) {
        if (matrizB[i][j] == 0) {
            var randomSize = Math.random() * 2 + 1;
            const textureIndex = Math.floor(Math.random() * buildingTextures.length);
            const texture = new THREE.TextureLoader().load(buildingTextures[textureIndex]);
            var geometry = new THREE.BoxGeometry(1, 1, randomSize);
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(j - l, l - i, randomSize / 2);
            scene.add(cube);
        } else if (matrizB[i][j] == 1) {
            var geometry = new THREE.BoxGeometry(1, 1, 0);
            const texture = new THREE.TextureLoader().load('assets/textures/calle.jpg');
            var material = new THREE.MeshBasicMaterial({ map: texture });

            if (
                matrizB[i - 1][j] == 1 &&
                matrizB[i + 1][j] == 1 &&
                matrizB[i][j - 1] == 1 &&
                matrizB[i][j + 1] == 1
            ) {
                material = new THREE.MeshBasicMaterial({ map: texture });
            } else if (
                matrizB[i - 1][j] == 1 &&
                matrizB[i + 1][j] == 1 &&
                matrizB[i][j - 1] == 0 &&
                matrizB[i][j + 1] == 0
            ) {
                material = new THREE.MeshBasicMaterial({ map: texture });
            } else if (
                matrizB[i + 1][j] == 0 &&
                matrizB[i - 1][j] == 0 &&
                matrizB[i][j + 1] == 1 &&
                matrizB[i][j - 1] == 1
            ) {
                material = new THREE.MeshBasicMaterial({ map: texture });
            } else if (
                matrizB[j - 1][i] == 1 &&
                matrizB[j + 1][i] == 1 &&
                matrizB[i - 1][j] == 0 &&
                matrizB[i + 1][j] == 1
            ) {
                material = new THREE.MeshBasicMaterial({ map: texture });
            }

            var cube1 = new THREE.Mesh(geometry, material);
            cube1.position.set(j - l, l - i, 0);
            scene.add(cube1);
            cube1.position.z = 0;
        }
    }
}
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.z = 15;

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}

animate();
