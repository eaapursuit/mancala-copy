import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { setupScene } from "./sceneSetup";
import { createGameBoard } from "./boardSetup";
import { createPits } from "./pitSetup";
import { updatePits } from "./updatePits";
import { createStone, animateStoneToPosition } from "./stoneSetup";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import PropTypes from "prop-types";

const ThreeScene = forwardRef(function ThreeScene(
  { state, previewPath = [], onPitHover, onPitOut, onPitClick },
  ref,
) {
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const pitsRef = useRef([]);
  const stonesRef = useRef([]);
  const previewMarkersRef = useRef([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const callbacksRef = useRef({ onPitHover, onPitOut, onPitClick });
  useEffect(() => {
    callbacksRef.current = { onPitHover, onPitOut, onPitClick };
  });
  // Tracks temp stones created during move animation so we can clean them up
  const animStones = useRef([]);

  // ─── Imperative API for parent (Gameboard) ──────────────────────────────

  useImperativeHandle(ref, () => ({
    /**
     * Animates stones moving from fromIndex through path, one by one.
     * Calls onComplete when all stones have landed.
     */
    playMoveAnimation(fromIndex, path, onComplete) {
      const scene = sceneRef.current;
      const pitsArr = pitsRef.current;
      if (!scene || !pitsArr.length) {
        onComplete?.();
        return;
      }

      const sourcePit = pitsArr[fromIndex];
      if (!sourcePit) {
        onComplete?.();
        return;
      }

      const isP1 = fromIndex <= 6;
      const tempStones = [];
      let stepIndex = 0;

      function dropNext() {
        if (stepIndex >= path.length) {
          // Remove temp stones — updatePits will recreate them in final positions
          tempStones.forEach((s) => {
            scene.remove(s);
            s.geometry?.dispose();
            s.material?.dispose();
          });
          onComplete?.();
          return;
        }

        const targetPitIndex = path[stepIndex];
        const targetPit = pitsArr[targetPitIndex];
        if (!targetPit) {
          stepIndex++;
          dropNext();
          return;
        }

        // Spawn stone at source pit, slightly elevated for arc effect
        const spread = sourcePit.userData.isStore ? 0.5 : 0.25;
        const stone = createStone(
          scene,
          sourcePit.position.x + (Math.random() - 0.5) * spread,
          sourcePit.position.y + 1.2,
          sourcePit.position.z + (Math.random() - 0.5) * spread,
          isP1 ? 1 : 2,
        );
        tempStones.push(stone);
        stepIndex++;

        // Animate to target pit with a small random landing offset
        const landSpread = targetPit.userData.isStore ? 0.55 : 0.28;
        animateStoneToPosition(
          stone,
          targetPit.position.x + (Math.random() - 0.5) * landSpread,
          targetPit.position.y + 0.15,
          targetPit.position.z + (Math.random() - 0.5) * landSpread,
          360,
        ).then(() => {
          // Small gap between stones so they feel sequential
          setTimeout(dropNext, 40);
        });
      }

      dropNext();
    },
    playCaptureAnimation({ fromPit, toStore }, onComplete) {
      const scene = sceneRef.current;
      const pitsArr = pitsRef.current;
      if (!scene || !pitsArr.length) {
        onComplete?.();
        return;
      }

      const sourcePit = pitsArr[fromPit];
      const targetStore = pitsArr[toStore];

      // Spawn a temporary stone at the captured pit
      const tempStone = createStone(
        scene,
        sourcePit.position.x,
        sourcePit.position.y + 1.0,
        sourcePit.position.z,
        1 
      );

      // Animate it flying into the store
      animateStoneToPosition(
        tempStone,
        targetStore.position.x,
        targetStore.position.y + 0.5,
        targetStore.position.z,
        600 // Faster 600ms duration for a snappy capture
      ).then(() => {
        // Clean up temp stone and finish turn
        scene.remove(tempStone);
        tempStone.geometry?.dispose();
        tempStone.material?.dispose();
        onComplete?.();
      });
    },
  }));

  // ─── Scene setup (runs once) ────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scene, camera, renderer } = setupScene(container);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    createGameBoard(scene);
    createPits(scene, pitsRef.current);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
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

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(pitsRef.current);

      if (intersects.length > 0) {
        const pit = intersects[0].object;
        callbacksRef.current.onPitHover?.(
          pit.userData.player,
          pit.userData.pitIndex,
        );
      } else {
        callbacksRef.current.onPitOut?.();
      }
    };

    const handleClick = () => {
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(pitsRef.current);
      if (!intersects.length) return;
      const pit = intersects[0].object;
      callbacksRef.current.onPitClick?.(
        pit.userData.player,
        pit.userData.pitIndex,
      );
    };

    // Touch support
    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(pitsRef.current);
      if (!intersects.length) return;
      const pit = intersects[0].object;
      callbacksRef.current.onPitClick?.(
        pit.userData.player,
        pit.userData.pitIndex,
      );
    };

    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("click", handleClick);
    renderer.domElement.addEventListener("touchend", handleTouchEnd);

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
      renderer.domElement.removeEventListener("touchend", handleTouchEnd);
      controls.dispose();
      renderer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Sync stone meshes with game state ─────────────────────────────────

  useEffect(() => {
    if (sceneRef.current && pitsRef.current.length) {
      updatePits(sceneRef.current, pitsRef.current, stonesRef.current, state);
    }
  }, [state]);

  // ─── Preview path markers ───────────────────────────────────────────────

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    previewMarkersRef.current.forEach((m) => {
      scene.remove(m);
      m.geometry?.dispose();
      m.material?.dispose();
    });
    previewMarkersRef.current = [];

    // previewPath.forEach((idx) => {
    //   const pit = pitsRef.current[idx];
    //   if (!pit) return;
    //   const radius = pit.userData.isStore ? 1.0 : 0.6;
    //   const geom = new THREE.CircleGeometry(radius, 32);
    //   const mat = new THREE.MeshBasicMaterial({
    //     color: 0xffd700,
    //     transparent: true,
    //     opacity: 0.5,
    //     side: THREE.DoubleSide,
    //   });
    //   const disc = new THREE.Mesh(geom, mat);
    //   disc.rotation.x = -Math.PI / 2;
    //   disc.position.set(pit.position.x, pit.position.y + 0.06, pit.position.z);
    //   scene.add(disc);
    //   previewMarkersRef.current.push(disc);
    // });

    return () => {
      previewMarkersRef.current.forEach((m) => {
        scene?.remove(m);
        m.geometry?.dispose();
        m.material?.dispose();
      });
      previewMarkersRef.current = [];
    };
  }, [previewPath]);

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="three-container"
      style={{ width: "100%", height: "100%" }}
    />
  );
});

ThreeScene.displayName = "ThreeScene";

ThreeScene.propTypes = {
  state: PropTypes.shape({
    pits: PropTypes.arrayOf(PropTypes.number).isRequired,
    currentPlayer: PropTypes.number,
  }).isRequired,
  previewPath: PropTypes.arrayOf(PropTypes.number),
  onPitHover: PropTypes.func.isRequired,
  onPitOut: PropTypes.func.isRequired,
  onPitClick: PropTypes.func.isRequired,
};

export default ThreeScene;
