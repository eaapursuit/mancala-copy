import * as THREE from "three";

export function setupScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5)
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  
  //Position camera
  camera.position.set(0, 20, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // add renderer to container
  container.appendChild(renderer.domElement);

  //Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 15, 5);
  directionalLight.castShadow = true;
  
  // Shadow properties
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -15;
  directionalLight.shadow.camera.right = 15;
  directionalLight.shadow.camera.top = 15;
  directionalLight.shadow.camera.bottom = -15;
  
  scene.add(directionalLight);

  // Add another light from the oposite side
  const secondLight = new THREE.DirectionalLight(0xffffff, 0.3);
  secondLight.position.set(-5, 10, -5);
  scene.add(secondLight);
  
  return { scene, camera, renderer };
}
