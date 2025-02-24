import { createStone } from "./stoneSetup";
import * as THREE from 'three'

export function updatePits(scene, pitsRef, stonesRef, state) {
  if (!state || !state.pits) {
    console.error("State or state.pits is undefined!")
    return null;
  }

  //Remove existing stones
  stonesRef.forEach((stone) => {
    scene.remove(stone);
    stone.geometry.dispose();
    stone.material.dispose();
  });
  stonesRef.length = 0;

  //add new stones based on state
  state.pits.forEach((stoneCount, pitIndex) => {
    const pit = pitsRef[pitIndex];
    if(!pit) return;

    const pitPos = pit.position;

    //arrange the stones in a spiral pattern inside each pit
    for (let i = 0; i < stoneCount; i++) {
      const angle = (i / stoneCount) * Math.PI * 2;
      const radius = 0.3 + (i % 3) * 0.15;
      const x = pitPos.x + Math.cos(angle) * radius;
      const y = pitPos.y + Math.floor(i / 6) * 0.2;
      const z = pitPos.z + Math.sin(angle) * radius;

      const stone = createStone(scene, x, y, z);
      stonesRef.push(stone);
    }
  });
}
