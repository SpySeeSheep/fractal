var renderer, camera, scene;

function initCanvas() {
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene = new THREE.Scene();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;

    // light = new THREE.DirectionalLight(0xffffff, 2);
    // light.castShadow = true;
    // light.position.set(0,150,300);
    // light.target.position.set(0,0,0);
    // scene.add(light);
    // scene.add(light.target);
}

function drawCylinder(color) {
    return radius => beg => end => {
        let material = new THREE.MeshBasicMaterial({
            color: color
        });
        let tube = new THREE.TubeGeometry(
            new THREE.LineCurve3(beg, end),
            26,
            radius,
            15,
            false
        );

        let mesh = new THREE.Mesh(tube, material);
        // mesh.receiveShadow = true;
        scene.add(mesh);
        renderer.render(scene, camera);
    }
}

function drawLine(color) {
    return beg => end => {
        let material = new THREE.LineBasicMaterial({
            color: color
        });
        let geometry = new THREE.BufferGeometry().setFromPoints([beg, end]);
        let line = new THREE.Line(geometry, material);
        scene.add(line);
        renderer.render(scene, camera);
    }
}

function renderTree(iter, p, alpha, oldAlpha, beta, beg, radius, len, color) {
    if (iter == 1) {
        let f = drawLine(color)(beg);
        let end = new THREE.Vector3(
            len * Math.cos(oldAlpha) * Math.cos(beta),
            len * Math.sin(oldAlpha),
            len * Math.cos(oldAlpha) * Math.sin(beta)
        );
        end.x += beg.x;
        end.y += beg.y;
        end.z += beg.z;
        f(end);
        return;
    }
    let rr = 0x050000;
    let gg = 0x001500;
    let bb = 0x000010;
    let f = drawCylinder(color)(radius)(beg);
    let end = new THREE.Vector3(
        len * Math.cos(oldAlpha) * Math.cos(beta),
        len * Math.sin(oldAlpha),
        len * Math.cos(oldAlpha) * Math.sin(beta)
    );
    end.x += beg.x;
    end.y += beg.y;
    end.z += beg.z;
    f(end);
    let nbeta;
    for (let i = 1; i <= 3; i++) {
        if (Math.random() <= 0.5) {
            nbeta = beta + alpha * (i - 1);
        } else {
            nbeta = beta - alpha * (i - 1) - Math.PI / 2;
        }
        if (Math.random() <= p) {
            renderTree(iter - 1, p, alpha, oldAlpha - (alpha), nbeta, end, radius - 0.1 * radius, len, color - rr + gg + bb);
        }
    }

    renderTree(iter - 1, p, alpha, oldAlpha, nbeta, end, radius - 0.1 * radius, len, color - rr + gg + bb);

}

initCanvas();

camera.position.y = 100;
camera.position.z = 450;

let phi = 0,
    delta = 0,
    clock = new THREE.Clock(),
    angularSpeed = THREE.Math.degToRad(40);
let radiusZ = camera.position.z;

let len = 30,
    beg = new THREE.Vector3(0, 0, 0),
    color = 0x5c0f0f,
    radius = 1,
    alpha = THREE.Math.degToRad(20),
    oldAlpha = Math.PI / 2,
    iter = 6,
    beta = THREE.Math.degToRad(30),
    p = 1;

// drawCylinder(color)(radius)(beg)(new THREE.Vector3(-10, 150, 80));
renderTree(iter, p, alpha, oldAlpha, beta, beg, radius, len, color);


moveCamera();

function moveCamera() {
    requestAnimationFrame(moveCamera);
    delta = clock.getDelta(); // getDelta() - возвращает интервал в долях секунды

    camera.position.x = Math.cos(phi) * radiusZ;
    camera.position.z = Math.sin(phi) * radiusZ;
    phi += angularSpeed * delta;

    camera.lookAt(new THREE.Vector3(0, camera.position.y, 0));
    renderer.render(scene, camera);
}