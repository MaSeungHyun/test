import * as THREE from "three";
import { MEMORY_SPOTS } from "@/data/memories";
import type { MemorySystem } from "@/core/systems/MemorySystem";

export type MemoryMarkersHandle = {
  update: (memory: MemorySystem) => void;
  dispose: () => void;
};

export function createMemoryMarkers(scene: THREE.Scene): MemoryMarkersHandle {
  const root = new THREE.Group();
  const markers = new Map<string, THREE.Mesh>();

  for (const spot of MEMORY_SPOTS) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 10, 10),
      new THREE.MeshBasicMaterial({
        color: 0x88a0d8,
        transparent: true,
        opacity: 0.55,
      }),
    );
    mesh.position.set(spot.x, 0.35, spot.z);
    root.add(mesh);
    markers.set(spot.id, mesh);
  }

  scene.add(root);

  return {
    update(memory) {
      for (const spot of MEMORY_SPOTS) {
        const mesh = markers.get(spot.id);
        if (!mesh) continue;
        const found = memory.entries.some((e) => e.id === spot.id);
        mesh.visible = !found;
      }
    },
    dispose() {
      scene.remove(root);
      root.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          c.geometry.dispose();
          (c.material as THREE.Material).dispose();
        }
      });
    },
  };
}
