import * as THREE from "three";

export function createGameBoard(scene) {
  //Creating the board
  const boardGeometry = new THREE.BoxGeometry(23, 1, 7);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.8,
  });

  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.receiveShadow = true;
  scene.add(board);

  return board;
}
