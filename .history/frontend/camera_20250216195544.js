import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Container
const container = document.getElementById('threejs-container');

// Scene
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Camera (Increase FOV & move back)
const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Move further back

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.5, 0); // Center on model
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Load Model
const loader = new GLTFLoader();
let movieCamera, mixer;

loader.load('cam2.glb', (gltf) => {
    movieCamera = gltf.scene;
    movieCamera.scale.set(15, 15, 15); // 50% larger
    movieCamera.position.set(0, -0.5, 0); // Lower it slightly
    scene.add(movieCamera);

    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(movieCamera);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }

    handleResize();
}, undefined, (error) => {
    console.error('Error loading model:', error);
});


// Handle Resize
function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.addEventListener('resize', handleResize);
handleResize();

// Animate
function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(0.01);
    if (movieCamera) movieCamera.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
}
animate();
