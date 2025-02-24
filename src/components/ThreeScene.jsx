import React, { useEffect, useRef } from "react";
import { setupScene } from "./sceneSetup";
import { createGameBoard } from "./boardSetup";
import { createPits } from "./pitSetup";
import { updatePits } from "./updatePits";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const ThreeScene = ({ state, onPitClick }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const pitsRef = useRef([]);
  const stonesRef = useRef([]); //Store stone meshes
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!state || !state.pits || !containerRef.current) return;

    //initialize scene
    const { scene, camera, renderer } = setupScene(containerRef.current);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Add game board and pits
    createGameBoard(scene);
    createPits(scene, pitsRef.current);

    //Update stones
    updatePits(scene, pitsRef.current, stonesRef.current, state);

    //Add OrbitControls with restrictions
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; //Limit vertical rotation
    controls.minDistance = 15;
    controls.maxDistance = 25;

    const handleResize = () => {
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    //handle mouse interaction
    const handleMouseMove = (event) => {
      if (!rendererRef.current || !cameraRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      //Highlighting hoverable pits
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(pitsRef.current);

      //reset all pit materials
      pitsRef.current.forEach((pit) => {
        if (pit.material.emissive) {
          pit.material.emissive.setHex(0x000000);
        }
      });

      //highlight valid pit
      if (intersects.length > 0) {
        const pit = intersects[0].object;
        const { player, pitIndex } = pit.userData;

        if (
          player === state.currentPlayer &&
          ((player === 1 && pitIndex < 6) ||
            (player === 2 && pitIndex > 6 && pitIndex < 13)) &&
          state.pits[pitIndex] > 0
        ) {
          pit.material.emissive.setHex(0x666666);
        }
      }
    };

    const handleClick = (event) => {
      if (!cameraRef.current) return;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(pitsRef.current);

      if (intersects.length > 0) {
        const pit = intersects[0].object;
        const { player, pitIndex } = pit.userData;

        if (state.pits[pitIndex] > 0) {
          onPitClick(player, pitIndex);
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);

    //Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current)
        return;

      requestAnimationFrame(animate);
      controls.update();

      //Animate stones
      stonesRef.current.forEach((stone) => {
        stone.rotation.x += 0.01;
        stone.rotation.y += 0.01;
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        rendererRef.current.domElement.removeEventListener(
          "mousemove",
          handleMouseMove
        );
        rendererRef.current.domElement.removeEventListener(
          "click",
          handleClick
        );
      }

      //Dispose of three.js objects
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        });
      }
      rendererRef.current.dispose();
      controls.dispose();
    };
  }, [state, onPitClick]);

  return (
    <div
      ref={containerRef}
      className="three-container"
      style={{ width: "100%", height: "400px" }}
    />
  );
};

export default ThreeScene;
