import React, { useState, useEffect, useRef } from "react";
import { setupScene } from "./sceneSetup";
import { createGameBoard } from "./boardSetup";
import { createPits } from "./pitSetup";
import { updatePits } from "./updatePits";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import PropTypes from "prop-types";

const ThreeScene = ({
  state,
  setState,
  stonesList,
  previewPath = [],
  onPitHover,
  onPitOut,
  onPitClick,
}) => {
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  //Stores the references to the invisible pit meshes and stone meshes
  const pitsRef = useRef([]);
  const stonesRef = useRef([]); //Store stone meshes
  const previewMarkersRef = useRef([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    //initialize scene
    const { scene, camera, renderer } = setupScene(container);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Add game board and pits
    createGameBoard(scene);
    // Create invisible interaction pits
    createPits(scene, pitsRef.current);

    //Add OrbitControls with restrictions
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; //Limit vertical rotation
    controls.minDistance = 15;
    controls.maxDistance = 25;

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    //handle mouse interaction
    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      //Highlighting hoverable pits
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(pitsRef.current);

      //highlight valid pit
      if (intersects.length > 0) {
        const pit = intersects[0].object;
        const { player, pitIndex } = pit.userData;
        onPitHover?.(player, pitIndex);
      } else {
        onPitOut?.();
      }
    };

    const handleClick = () => {
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(pitsRef.current);
      if (!intersects.length) return;
      const pit = intersects[0].object;
      onPitClick?.(pit.userData.player, pit.userData.pitIndex);
    };

    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);

    //Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("click", handleClick);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Render the dynamic stone positions
  useEffect(() => {
    if (sceneRef.current && pitsRef.current && stonesRef.current) {
      updatePits(sceneRef.current, pitsRef.current, stonesRef.current, state);
    }
  }, [state]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    previewMarkersRef.current.forEach((m) => {
      scene.remove(m);
      m.geometry?.dispose();
      m.material?.dispose();
    });
    previewMarkersRef.current = [];

    //add new discs
    previewPath.forEach((idx) => {
      const pit = pitsRef.current[idx];
      if (!pit) return;

      const radius = pit.userData.isStore ? 1.0 : 0.6;
      const geom = new THREE.CircleGeometry(radius, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      
      const disc = new THREE.Mesh(geom, mat);
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(pit.position.x, pit.position.y + 0.05, pit.position.z);
      scene.add(disc);
      previewMarkersRef.current.push(disc);
    });

    return () => {
      previewMarkersRef.current.forEach(m => {
        if (scene) scene.remove(m);
        m.geometry?.dispose();
        m.material?.dispose();
      });
      previewMarkersRef.current = [];
    };
  }, [previewPath]);

  return (
    <div
      ref={containerRef}
      className="three-container"
      style={{ width: "100%", height: "400px" }}
    />
  );
};

ThreeScene.propTypes = {
  state: PropTypes.shape({
    pits: PropTypes.arrayOf(PropTypes.number).isRequired,
    currentPlayer: PropTypes.number,
  }).isRequired,
setState: PropTypes.func.isRequired,
stonesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      pitIndex: PropTypes.number.isRequired,
    })
  ).isRequired,
previewPath: PropTypes.arrayOf(PropTypes.number).isRequired,
onPitHover: PropTypes.func.isRequired,
onPitOut: PropTypes.func.isRequired,
onPitClick: PropTypes.func.isRequired,
};

export default ThreeScene;
