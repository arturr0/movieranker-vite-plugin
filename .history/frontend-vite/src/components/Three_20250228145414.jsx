import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Three = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Scene
        const scene = new THREE.Scene();

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Camera
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 2, 5);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0.5, 0);
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

        loader.load("cam2.glb", (gltf) => {
            movieCamera = gltf.scene;
            movieCamera.scale.set(15, 15, 15); // Match Vanilla JS scale
            movieCamera.position.set(0, -0.5, 0); // Match position
            scene.add(movieCamera);

            // Handle animations
            if (gltf.animations.length) {
                mixer = new THREE.AnimationMixer(movieCamera);
                gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
            }

            handleResize();
        });

        // Handle Resize
        function handleResize() {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        window.addEventListener("resize", handleResize);

        // Animate
        function animate() {
            requestAnimationFrame(animate);
            if (mixer) mixer.update(0.01);
            if (movieCamera) movieCamera.rotation.y += 0.005; // Add rotation
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default Three;
