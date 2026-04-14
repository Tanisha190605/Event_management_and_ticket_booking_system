import * as THREE from 'three';

export function initThreeBackground() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // === Particle System ===
  const particleCount = 800;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x6366F1), // indigo
    new THREE.Color(0x14B8A6), // teal
    new THREE.Color(0x38BDF8), // sky
    new THREE.Color(0x818CF8), // light indigo
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    sizes[i] = Math.random() * 2 + 0.5;
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vOpacity;
      uniform float uTime;
      uniform float uPixelRatio;
      void main() {
        vColor = color;
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + position.x * 0.5) * 0.5;
        pos.x += cos(uTime * 0.2 + position.y * 0.3) * 0.3;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * uPixelRatio * (20.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vOpacity = smoothstep(0.0, 10.0, -mvPosition.z) * (1.0 - smoothstep(40.0, 60.0, -mvPosition.z));
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vOpacity * 0.6;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // === Floating shapes ===
  const shapesGroup = new THREE.Group();
  scene.add(shapesGroup);

  const shapeMaterial = (color) => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.06,
    wireframe: true,
  });

  const shapes = [
    { geo: new THREE.IcosahedronGeometry(3, 1), pos: [-20, 10, -15], color: 0x6366F1, speed: 0.3 },
    { geo: new THREE.OctahedronGeometry(2, 0), pos: [22, -8, -10], color: 0x14B8A6, speed: 0.4 },
    { geo: new THREE.TetrahedronGeometry(2.5, 0), pos: [-15, -12, -12], color: 0x38BDF8, speed: 0.35 },
    { geo: new THREE.TorusGeometry(2, 0.5, 8, 24), pos: [18, 15, -18], color: 0x818CF8, speed: 0.25 },
    { geo: new THREE.DodecahedronGeometry(1.5, 0), pos: [0, -18, -8], color: 0x2DD4BF, speed: 0.45 },
  ];

  const meshes = shapes.map(s => {
    const mesh = new THREE.Mesh(s.geo, shapeMaterial(s.color));
    mesh.position.set(...s.pos);
    mesh.userData = { speed: s.speed, initialPos: [...s.pos] };
    shapesGroup.add(mesh);
    return mesh;
  });

  // === Wave plane ===
  const waveGeo = new THREE.PlaneGeometry(100, 100, 64, 64);
  const waveMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      uniform float uTime;
      varying float vHeight;
      void main() {
        vec3 pos = position;
        pos.z = sin(pos.x * 0.15 + uTime * 0.5) * cos(pos.y * 0.15 + uTime * 0.3) * 1.5;
        vHeight = pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying float vHeight;
      void main() {
        float alpha = smoothstep(-1.5, 1.5, vHeight) * 0.04;
        gl_FragColor = vec4(0.388, 0.4, 0.945, alpha);
      }
    `,
    transparent: true,
    wireframe: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const waveMesh = new THREE.Mesh(waveGeo, waveMat);
  waveMesh.rotation.x = -Math.PI * 0.4;
  waveMesh.position.y = -15;
  waveMesh.position.z = -20;
  scene.add(waveMesh);

  // === Mouse tracking ===
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const glow = document.getElementById('cursor-glow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });

  // === Resize ===
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // === Animate ===
  const startTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = (performance.now() - startTime) * 0.001;

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Parallax camera
    camera.position.x = mouseX * 3;
    camera.position.y = -mouseY * 2;
    camera.lookAt(0, 0, 0);

    // Particle animation
    particleMaterial.uniforms.uTime.value = elapsed;

    // Rotate particles slightly
    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = mouseY * 0.1;

    // Floating shapes
    meshes.forEach((mesh) => {
      const { speed, initialPos } = mesh.userData;
      mesh.rotation.x = elapsed * speed * 0.5;
      mesh.rotation.y = elapsed * speed * 0.3;
      mesh.position.y = initialPos[1] + Math.sin(elapsed * speed) * 2;
      mesh.position.x = initialPos[0] + Math.cos(elapsed * speed * 0.7) * 1;
    });

    // Wave animation
    waveMat.uniforms.uTime.value = elapsed;

    renderer.render(scene, camera);
  }

  animate();
}
