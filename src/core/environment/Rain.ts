import * as THREE from "three";
import { FLOOR_SIZE } from "@/core/constants";

export type RainHandle = {
  update: (delta: number) => void;
  dispose: () => void;
};

export function createRain(scene: THREE.Scene): RainHandle {
  const count = 4000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * FLOOR_SIZE;
    positions[i * 3 + 1] = Math.random() * 18 + 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * FLOOR_SIZE;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xa8a0c8,
    size: 0.06,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return {
    update(delta) {
      const attr = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = attr.getY(i) - delta * 14;
        if (y < 0) {
          y = 16 + Math.random() * 4;
          attr.setX(i, (Math.random() - 0.5) * FLOOR_SIZE);
          attr.setZ(i, (Math.random() - 0.5) * FLOOR_SIZE);
        }
        attr.setY(i, y);
      }
      attr.needsUpdate = true;
    },
    dispose() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    },
  };
}
