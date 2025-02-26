import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Get container
const container = document.getElementById('threejs-container');

// Scene setup
const scene = new THREE.Scene();

// Renderer with transparent background
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor(0x000000, 0); // Transparent background
container.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1, 3); // Move closer to the model

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(-1, 0, 0); // Prevent auto-centering
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Load 3D model
const loader = new GLTFLoader();
let movieCamera, mixer;

loader.load('cam2.glb', (gltf) => {
    console.log('Loaded GLB model:', gltf);
    
    movieCamera = gltf.scene;
    movieCamera.scale.set(20, 20, 20);  // Adjust scale
    movieCamera.position.set(-1, 0, 0); // Move to the left
    scene.add(movieCamera);

    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(movieCamera);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }

    handleResize(); // Ensure correct placement after loading
}, undefined, (error) => {
    console.error('Error loading GLB file:', error);
});

// Resize handling
function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.addEventListener('resize', handleResize);
handleResize(); // Call once on load

// Render loop
function animate() {
    requestAnimationFrame(animate);
    
    if (mixer) mixer.update(0.01);
    if (movieCamera) movieCamera.rotation.y += 0.01; // Keep rotation

    controls.update();
    renderer.render(scene, camera);
}
animate();
