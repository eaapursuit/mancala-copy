import * as THREE from "three";

export function createStone(scene, x, y, z, player = 1) {
  const stoneGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  
  const playerColors = {
    1: "#E2DAD3",
    2: 0X2F4F4F
  };
  
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: playerColors[player] || 0x808080,
    roughness: 0.5,
  });

  const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);

  stone.position.set(x, y, z);
  stone.castShadow = true;
  stone.receiveShadow = true;

  scene.add(stone);
  return stone;
}

export function animateStoneToPosition(
  stone,
  targetX,
  targetY,
  targetZ,
  duration = 1000
) {
  if (!stone) return Promise.resolve();

  const startPosition = stone.position.clone();
  const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);
  const startTime = Date.now();

  return new Promise((resolve) => {
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);

      stone.position.lerpVectors(startPosition, targetPosition, easeOut);

      if (progress < 1) {
        const bounceHeight = Math.sin(progress * Math.PI) * 0.3;
        stone.position.y = targetY + bounceHeight;
      } else {
        stone.position.copy(targetPosition);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    animate();
  });
}

export function createStoneWithanimation(
  scene,
  startX,
  startY,
  startZ,
  targetX,
  targetY,
  targetZ,
  player = 1
) {
  const stone = createStone(scene, startX, startY, startZ, player);

  setTimeout(() => {
    animateStoneToPosition(stone, targetX, targetY, targetZ);
  }, 100);

  return stone;
}

export function createStonesWithStaggeredAnimation(
  scene,
  positions,
  delay = 200
) {
  const stones = [];

  positions.forEach((pos, index) => {
    const { startX, startY, startZ, targetX, targetY, targetZ, player = 1 } = pos;
    const stone = createStone(scene, startX, startY, startZ, player);
    stones.push(stone);

    // Stagger the animations
    setTimeout(() => {
      animateStoneToPosition(stone, targetX, targetY, targetZ);
    }, index * delay);
  });

  return stones;
}
