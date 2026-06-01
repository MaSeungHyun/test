import * as THREE from "three";

export type FloorHandle = {
  dispose: () => void;
};

export function createFloor(scene: THREE.Scene, size: number): FloorHandle {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({
      color: 0x0a0810,
      roughness: 0.98,
      metalness: 0.02,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(size, size, 0x2a2238, 0x120e18);
  grid.position.y = 0.01;
  scene.add(grid);

  return {
    dispose: () => {
      scene.remove(ground);
      scene.remove(grid);
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
    },
  };
}
