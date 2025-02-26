import { createStone } from "./stoneSetup";
import * as THREE from 'three'

export function updatePits(scene, pitsRef, stonesRef, state) {

  //Remove existing stones
  stonesRef.forEach((stone) => {
    scene.remove(stone);
    stone.geometry.dispose();
    stone.material.dispose();
  });
  stonesRef.length = 0;

  if (!state || !state.pits) {
    console.error("State or state.pits is undefined!")
    return;
  }

  //add new stones based on state
  state.pits.forEach((stoneCount, pitIndex) => {
    const pitMesh = pitsRef[pitIndex];
    if(!pitMesh) return;

    const {x, y, z} = pitMesh.position;

    //arrange the stones in a spiral pattern inside each pit
    for (let i = 0; i < stoneCount; i++) {
      const angle = (i / stoneCount) * Math.PI * 2;
      const radius = 0.3 + (i % 3) * 0.1;
      const stoneX = x + Math.cos(angle) * radius;
      const stoneZ = z + Math.sin(angle) * radius;
      const stoneY = y + 0.02 * (i / 5);

      const stoneMesh = createStone(scene, stoneX, stoneY, stoneZ);
      stonesRef.push(stoneMesh);
    }
  });
}
