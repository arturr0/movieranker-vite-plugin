import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Get the container
const container = document.getElementById('threejs-container');
const width = container.clientWidth;
const height = container.clientHeight;

// Scene setup
const scene = new THREE.Scene();

// Renderer with transparent background
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0); // Transparent background
container.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 3, 5);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Load 3D model and fit it inside the canvas
const loader = new GLTFLoader();
let movieCamera;
let mixer;

loader.load('cam2.glb', (gltf) => {
    console.log('Loaded GLB model:', gltf);

    movieCamera = gltf.scene;
    scene.add(movieCamera);

    // Auto-fit the model inside the canvas
    const box = new THREE.Box3().setFromObject(movieCamera);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // Adjust camera to fit the model
    camera.position.set(center.x, center.y, size * 1.5);
    camera.lookAt(center);

    // Enable rotation animation
    movieCamera.rotation.y = 0;

    // Handle animations if available
    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(movieCamera);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    }
}, undefined, (error) => {
    console.error('Error loading GLB file:', error);
});

// Resize handling
window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});

// Render loop with rotation animation
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(0.01);
    }

    if (movieCamera) {
        movieCamera.rotation.y += 0.01; // Rotates the model
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();
