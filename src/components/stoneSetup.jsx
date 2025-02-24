import * as THREE from "three";

export function createStone(scene, x, y, z) {
  const stoneGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: Math.random() > 0.5 ? 0x808080 : 0x696969,
    roughness: 0.5,
  });

  const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
  stone.position.set(x, y, z);
  stone.castShadow = true;
  stone.receiveShadow = true;

  scene.add(stone)
  return stone;
}
