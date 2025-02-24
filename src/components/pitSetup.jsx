import * as THREE from "three";

export function createPits(scene, pitsRef) {
  //Creating the pits
  const pitGeometry = new THREE.CylinderGeometry(0.8, 1, 1, 32);
  const pitMaterial = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.6,
  });

  //Create store pits (larger cylinders)
  const storePitGeometry = new THREE.CylinderGeometry(1.2, 1.5, 2, 32);

  //Create player 1 pits (bottom row)
  for (let i = 0; i < 6; i++) {
    const pit = new THREE.Mesh(pitGeometry, pitMaterial);
    pit.position.set(-6 + i * 2.4, 1, 1.5);
    pit.castShadow = true;
    pit.receiveShadow = true;
    pit.userData = { pitIndex: i, player: 1 }; //Store pit data for raycasting
    scene.add(pit);
    pitsRef.push(pit);
  }

  //Create player 2 pits (top row)
  for (let i = 0; i < 6; i++) {
    const pit = new THREE.Mesh(pitGeometry, pitMaterial);
    pit.position.set(6 - i * 2.4, 1, -1.5);
    pit.castShadow = true;
    pit.receiveShadow = true;
    pit.userData = { pitIndex: 12 - i, player: 2 }; //Store pit data
    scene.add(pit);
    pitsRef.push(pit);
  }

  //Player 1 store
  const player1Store = new THREE.Mesh(storePitGeometry, pitMaterial);
  player1Store.position.set(9, 1, 0);
  player1Store.castShadow = true;
  player1Store.receiveShadow = true;
  player1Store.userData = { pitIndex: 6, player: 1 };
  scene.add(player1Store);
  pitsRef.push(player1Store);

  //Player 2 store
  const player2Store = new THREE.Mesh(storePitGeometry, pitMaterial);
  player2Store.position.set(-9, 1, 0);
  player2Store.castShadow = true;
  player2Store.receiveShadow = true;
  player2Store.userData = { pitIndex: 13, player: 2 };
  scene.add(player2Store);
  pitsRef.push(player2Store);
}
