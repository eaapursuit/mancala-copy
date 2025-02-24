import * as THREE from "three";

export function setupScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0)
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  //Position camera
  camera.position.set(0, 20, 0);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // add renderer to container
  container.appendChild(renderer.domElement);



  //Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  return { scene, camera, renderer };
}
