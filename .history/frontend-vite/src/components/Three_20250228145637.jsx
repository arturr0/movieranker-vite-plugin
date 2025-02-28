import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 2, 3);
scene.add(light);

// GLTF Model Loading
const loader = new GLTFLoader();
import modelUrl from '/cam2.glb?url'; // Vite handles asset URLs

loader.load(
  modelUrl,
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1); // Adjust size
    model.position.set(0, 0, 0); // Center model
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('Error loading GLTF model:', error);
  }
);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Responsive Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
