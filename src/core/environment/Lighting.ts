import * as THREE from "three";

export type LightingHandle = {
  setAccentPosition: (position: THREE.Vector3) => void;
  dispose: () => void;
};

/** 어두운 밤 — 가로등만 돋보이게 */
export function createLighting(scene: THREE.Scene): LightingHandle {
  const ambient = new THREE.AmbientLight(0x1a1428, 0.12);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0x2a2040, 0x030208, 0.1);
  scene.add(hemi);

  const moon = new THREE.DirectionalLight(0x6a5a88, 0.18);
  moon.position.set(-6, 14, 4);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.near = 0.5;
  moon.shadow.camera.far = 50;
  const shadowSpan = 45;
  moon.shadow.camera.left = -shadowSpan;
  moon.shadow.camera.right = shadowSpan;
  moon.shadow.camera.top = shadowSpan;
  moon.shadow.camera.bottom = -shadowSpan;
  scene.add(moon);

  const accent = new THREE.PointLight(0xc97b9a, 0.12, 10);
  accent.position.set(0, 2, 0);
  scene.add(accent);

  return {
    setAccentPosition: (position) => {
      accent.position.set(position.x, 1.8, position.z);
    },
    dispose: () => {
      scene.remove(ambient);
      scene.remove(hemi);
      scene.remove(moon);
      scene.remove(accent);
    },
  };
}
