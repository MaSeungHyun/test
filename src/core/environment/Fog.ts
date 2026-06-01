import * as THREE from "three";
import { FLOOR_SIZE } from "@/core/constants";

export type FogHandle = {
  dispose: () => void;
};

export function createFog(scene: THREE.Scene): FogHandle {
  const fog = new THREE.Fog(0x040208, 10, FLOOR_SIZE * 0.88);
  scene.fog = fog;

  return {
    dispose: () => {
      scene.fog = null;
    },
  };
}
