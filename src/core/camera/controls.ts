import { MOUSE } from "three";
import type { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type GameOrbitControls = OrbitControls & {
  userDragging: boolean;
};

export function createGameOrbitControls(
  camera: PerspectiveCamera,
  domElement: HTMLElement,
): GameOrbitControls {
  const controls = new OrbitControls(camera, domElement) as GameOrbitControls;
  controls.userDragging = false;

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 5;
  controls.maxPolarAngle = Math.PI / 2 - 0.08;
  controls.minPolarAngle = 0.35;
  controls.enablePan = false;
  controls.rotateSpeed = 0.85;
  controls.zoomSpeed = 0.9;
  controls.screenSpacePanning = false;

  controls.mouseButtons = {
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN,
  };

  controls.addEventListener("start", () => {
    controls.userDragging = true;
  });
  controls.addEventListener("end", () => {
    controls.userDragging = false;
  });

  return controls;
}
