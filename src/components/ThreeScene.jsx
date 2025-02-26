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
  //Stores the references to the invisible pit meshes and stone meshes
  const pitsRef = useRef([]);
  const stonesRef = useRef([]); //Store stone meshes
  
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const highlightMarkerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    //initialize scene
    const { scene, camera, renderer } = setupScene(containerRef.current);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Add game board and pits
    createGameBoard(scene);

    // Create invisible interaction pits
    createPits(scene, pitsRef.current);

    //Add OrbitControls with restrictions
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.maxPolarAngle = Math.PI / 2.1; //Limit vertical rotation
    controls.minDistance = 15;
    controls.maxDistance = 25;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    //handle mouse interaction
    const handleMouseMove = (event) => {
      if (!rendererRef.current || !cameraRef.current || !state) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      //Highlighting hoverable pits
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(pitsRef.current);

      // Hide highlight ring if it exists
      if (highlightMarkerRef.current) {
        scene.remove(highlightMarkerRef.current);
        highlightMarkerRef.current = null;
      }

      //highlight valid pit
      if (intersects.length > 0) {
        const pit = intersects[0].object;
        const { player, pitIndex, isStore } = pit.userData;

        if (
          !isStore &&
          player === state.currentPlayer &&
          state.pits[pitIndex] > 0
        ) {
          const ringGeometry = new THREE.RingGeometry(0.7, 0.9, 32);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
          });

          highlightMarkerRef.current = new THREE.Mesh(
            ringGeometry,
            ringMaterial
          );
          highlightMarkerRef.current.rotation.x = -Math.PI / 2;
          highlightMarkerRef.current.position.set(
            pit.position.x,
            0.51,
            pit.position.z
          );

          scene.add(highlightMarkerRef.current);
        }
      }
    };

    const handleClick = (event) => {
      if (!cameraRef.current || !state || !onPitClick) return;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(pitsRef.current);

      if (intersects.length > 0) {
        const pit = intersects[0].object;
        const { player, pitIndex, isStore } = pit.userData;

        if (
          !isStore &&
          player === state.currentPlayer &&
          state.pits[pitIndex] > 0) {
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
      renderer.render(scene, camera);
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

      renderer.dispose();
      controls.dispose();

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
      
    };
  }, []);

useEffect(() => {
  if(!sceneRef.current) return;
  updatePits(sceneRef.current, pitsRef.current, stonesRef.current, state);
}, [state])
  return (
    <div
      ref={containerRef}
      className="three-container"
      style={{ width: "100%", height: "400px" }}
    />
  );
};

export default ThreeScene;
