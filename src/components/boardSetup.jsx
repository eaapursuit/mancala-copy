import * as THREE from "three";
import { CSG } from "three-csg-ts";

function createRectShape (width, height, cornerRadius) {
  const shape = new THREE.Shape();

  //We're going to start at the top-left corner
  shape.moveTo(-width / 2 + cornerRadius, height / 2);

  // Top edge
  shape.lineTo(width / 2 - cornerRadius, height / 2);
  // Top-right corner
  shape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - cornerRadius)

  // Right edge
  shape.lineTo(width / 2, -height / 2 + cornerRadius);
  // Bottom-right corner
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2 - cornerRadius, -height / 2);

  //Bottom edge
  shape.lineTo(-width / 2 + cornerRadius, -height / 2);

// Bottom-left corner
shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + cornerRadius);

// Left edge
shape.lineTo(-width / 2, height / 2 - cornerRadius);
//Top-left corner
shape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + cornerRadius, height / 2);

return shape;
}

export function createGameBoard(scene) {
  // Creating the board
  const boardGeometry = new THREE.BoxGeometry(20, 2, 8);
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513, // Dark brown for the main board
    roughness: 0.5,
    metalness: 0.2,
    side: THREE.DoubleSide
  });

  

  // Create a lighter brown material for the pits
  const pitMaterial = new THREE.MeshStandardMaterial({
    color: 0xdeb887, // Lighter brown (burlywood color)
    roughness: 0.4,
    metalness: 0.3,
    side: THREE.DoubleSide
  });

  const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
  boardMesh.updateMatrix();

  // Converting the board into a CSG object
  let boardCSG = CSG.fromMesh(boardMesh);

  // Define all pit positions
  const holeDefinitions = [
    //Player 1 row
    { x: -6, z: 2, pitIndex: 0, player: 1, store: false },
    { x: -3.6, z: 2, pitIndex: 1, player: 1, store: false },
    { x: -1.2, z: 2, pitIndex: 2, player: 1, store: false },
    { x: 1.2, z: 2, pitIndex: 3, player: 1, store: false },
    { x: 3.6, z: 2, pitIndex: 4, player: 1, store: false },
    { x: 6, z: 2, pitIndex: 5, player: 1, store: false },

    //Player 2 row
    { x: -6, z: -2, pitIndex: 7, player: 2, store: false },
    { x: -3.6, z: -2, pitIndex: 8, player: 2, store: false },
    { x: -1.2, z: -2, pitIndex: 9, player: 2, store: false },
    { x: 1.2, z: -2, pitIndex: 10, player: 2, store: false },
    { x: 3.6, z: -2, pitIndex: 11, player: 2, store: false },
    { x: 6, z: -2, pitIndex: 12, player: 2, store: false },

    // Player 1 store
    { x: 8.5, z: 0, pitIndex: 6, player: 1, store: true },
    // Player 2 store
    { x: -8.5, z: 0, pitIndex: 13, player: 2, store: true },
  ];

  // For each hole, create a cylinder and subtract it
  holeDefinitions.forEach((def) => {
    // Determine dimensions based on pit type
    let radius, height;
    
    if (def.store) {
      // Use shape based approached
      const storeShape = createRectShape(2, 6, 0.8);
      const extrudeSettings = { depth: 0.6, bevelEnabled: false };
      const storeGeometry = new THREE.ExtrudeGeometry(storeShape, extrudeSettings);
      const storeMesh = new THREE.Mesh(storeGeometry, boardMaterial);

      storeMesh.rotation.x = -Math.PI / 2;
      storeMesh.position.set(def.x, 1 - 0.6, def.z);
      storeMesh.updateMatrix();

      const storeCSG = CSG.fromMesh(storeMesh);
      boardCSG = boardCSG.subtract(storeCSG);
    } else {
      // Regular pit indentation
      radius = 0.8;
      height = 0.8;
    }
    
    // // Create the cylinder geometry for subtraction
     const holeGeometry = new THREE.CylinderGeometry(radius, radius, height, 32);
     const holeMesh = new THREE.Mesh(holeGeometry, boardMaterial);
    
    // // Create cylinder geometry for the hole
     if(def.store) {
       holeMesh.scale.set(1.3, 1, 3)
     }

    // // Position the cylinder so it creates a partial indentation
      holeMesh.position.set(def.x, 1 - (height / 2), def.z);

    // //update the hole mesh matrix before CSG:
      holeMesh.updateMatrix();
     const holeCSG = CSG.fromMesh(holeMesh);

    // // Convert to CSG and subtract from board
     boardCSG = boardCSG.subtract(holeCSG);
    
  });

  // Convert the final subtracted CSG back to a single mesh
  const concaveBoard = CSG.toMesh(
    boardCSG,
    boardMesh.matrix,
    boardMaterial
  );
  
  // Enable shadows
  concaveBoard.castShadow = true;
  concaveBoard.receiveShadow = true;
  
  scene.add(concaveBoard);
  
  return concaveBoard;
}