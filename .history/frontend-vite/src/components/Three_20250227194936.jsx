import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import camModel from "/src/assets/cam2.glb";

const Three = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Create Scene
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
        let mixer;

        loader.load(new URL(camModel, import.meta.url).href, (gltf) => {
            const model = gltf.scene;
            model.scale.set(15, 15, 15);
            model.position.set(0, -0.5, 0);
            scene.add(model);

            if (gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);
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
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Cleanup on Unmount
        return () => {
            container.removeChild(renderer.domElement);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Three;
