import * as THREE from "three";

export function createPits(scene, pitsRef) {
  const pitDefinitions = [
    //Player 1 row
    { x: -6, z: 2, pitIndex: 0, player: 1 }, // Pit index 0
    { x: -3.6, z: 2, pitIndex: 1, player: 1 }, // Pit index 1
    { x: -1.2, z: 2, pitIndex: 2, player: 1 }, // Pit index 2
    { x: 1.2, z: 2, pitIndex: 3, player: 1 }, // Pit index 3
    { x: 3.6, z: 2, pitIndex: 4, player: 1 }, // Pit index 4
    { x: 6, z: 2, pitIndex: 5, player: 1 }, // Pit index 5

    //Player 2 row
    { x: -6, z: -2, pitIndex: 7, player: 2 }, // Pit index 12
    { x: -3.6, z: -2, pitIndex: 8, player: 2 }, // Pit index 11
    { x: -1.2, z: -2, pitIndex: 9, player: 2 }, // Pit index 10
    { x: 1.2, z: -2, pitIndex: 10, player: 2 }, // Pit index 9
    { x: 3.6, z: -2, pitIndex: 11, player: 2 }, // Pit index 8
    { x: 6, z: -2, pitIndex: 12, player: 2 }, // Pit index 7

    // Player 1 store
    { x: 9, z: 0, pitIndex: 6, player: 1, store: true },
    // Player 2 store
    { x: -9, z: 0, pitIndex: 13, player: 2, store: true },
  ];

  //Creating the pits
  const pitMaterial = new THREE.MeshStandardMaterial({
    transparent: true,
    color: 0xdeb887,
    roughness: 0.6,
    opacity: 0,
    depthWrite: false,
  });

  pitDefinitions.forEach((def) => {
    //Create geometry based on pit type
    let geometry;

    if (def.store) {
      //Store pit which will be larger
      geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
    } else {
      //Refgular pit
      geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    }

    // Create the interaction mesh (invisible)
    const pit = new THREE.Mesh(geometry, pitMaterial);

    pit.position.set(def.x, 1.1, def.z);

    pit.userData = {
      pitIndex: def.pitIndex,
      player: def.player,
      isStore: def.store || false,
    }; //Store pit data for raycasting
    scene.add(pit);
    pitsRef.push(pit);
  });

  pitsRef.sort((a, b) => a.userData.pitIndex - b.userData.pitIndex);
}
