import type { Object3D, PerspectiveCamera } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const INITIAL_DISTANCE = 8;
const INITIAL_HEIGHT = 4;

export function setupInitialCamera(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  target: Object3D,
  focusHeight: number,
): void {
  const focusY = target.position.y + focusHeight;
  controls.target.set(target.position.x, focusY, target.position.z);
  camera.position.set(
    target.position.x,
    focusY + INITIAL_HEIGHT,
    target.position.z + INITIAL_DISTANCE,
  );
  controls.update();
}
