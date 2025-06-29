// src/components/CastleViewer.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default function CastleViewer() {
  const mountRef = useRef();

  useEffect(() => {
    const width  = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // ─── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0x87ceeb, 1);
    renderer.toneMapping           = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure   = 1.2;                // tweak 0.5–2.0
    renderer.outputEncoding         = THREE.sRGBEncoding;
    renderer.shadowMap.enabled      = true;
    renderer.shadowMap.type         = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // ─── Scene & Camera ───────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
    camera.position.set(-230, 40, -3); // 90 degrees left, closer to the castle
    camera.lookAt(0, 5, 0);       // Look at the center/front of the castle

    // ─── Controls ─────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableRotate = true;  // Disable rotation
    controls.enablePan = true;     // Disable panning
    controls.enableZoom = true;    // Disable zooming
    controls.target.set(0, 5, 0); // Make sure this matches the lookAt point
    controls.update();

    // ─── Sky ──────────────────────────────────────────────────
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },    // Sky blue
        bottomColor: { value: new THREE.Color(0xffffff) }, // White
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // ─── Sun ──────────────────────────────────────────────────
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(50, 50, -50); // Moved higher (y: 30 -> 50)
    sun.visible = false; // Hide the sun
    scene.add(sun);

    // Add sun glow effect
    const sunGlowGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sunGlow.position.copy(sun.position);
    sunGlow.visible = false; // Hide the sun glow too
    scene.add(sunGlow);

    // ─── Ground Plane ──────────────────────────────────────────
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000); // Much larger ground
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: 0x228B22, // Forest green
      transparent: true,
      opacity: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);

    // ─── HDR Environment (IBL) ─────────────────────────────────
    // (Removed HDR loading and PMREMGenerator for optimization)
    // Scene will use only the defined lights for illumination.

    // ─── Load Your GLB ─────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      '/models/castle1.glb',
      (gltf) => {
        // enable shadows on all meshes
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(gltf.scene);
      },
      (xhr) => console.log(`Castle ${ (xhr.loaded/xhr.total*100).toFixed(0) }% loaded`),
      console.error
    );

    // ─── Three-Point Lights ────────────────────────────────────
    // Key light (warm, strong) - positioned near sun
    const key = new THREE.DirectionalLight(0xfff1e0, 4);
    key.position.copy(sun.position);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 500;
    key.shadow.camera.left = -100;
    key.shadow.camera.right = 100;
    key.shadow.camera.top = 100;
    key.shadow.camera.bottom = -100;
    scene.add(key);

    // Fill light (cooler, weaker)
    const fill = new THREE.DirectionalLight(0xaaaaff, 0.5);
    fill.position.set(-5, 3, 5);
    scene.add(fill);

    // Back/Rim light to separate from BG
    const back = new THREE.DirectionalLight(0xffffff, 0.8);
    back.position.set(-10, 5, -10);
    scene.add(back);

    // Optional Hemisphere for subtle sky/ground tint
    scene.add(new THREE.HemisphereLight(0xeeeeff, 0x444422, 0.3));
    scene.add( new THREE.HemisphereLight(0xeeeeff/*sky*/, 0x777755/*ground*/, 0.6) );

    scene.add( new THREE.AmbientLight(0xffffff, 0.2) );

    const fillBelow = new THREE.DirectionalLight(0xffffff, 0.15);
    fillBelow.position.set(0, -10, 0);
    scene.add(fillBelow);

    // ─── Render Loop & Resize ─────────────────────────────────
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ─── Cleanup ────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
}
