import * as THREE from "three";
import { FLOOR_SIZE } from "@/core/constants";
import { QUEST_CHAIN } from "@/data/quests";

export type ScatterPropsHandle = {
  questMarker: THREE.Object3D;
  setQuestTarget: (x: number, z: number) => void;
  dispose: () => void;
};

const matBuilding = new THREE.MeshStandardMaterial({
  color: 0x120e1a,
  roughness: 0.95,
});
const matBench = new THREE.MeshStandardMaterial({ color: 0x2a2238 });
const matPole = new THREE.MeshStandardMaterial({ color: 0x1a1525 });
const matLamp = new THREE.MeshStandardMaterial({
  color: 0xffe8c8,
  emissive: 0xffa855,
  emissiveIntensity: 3.5,
  toneMapped: false,
});

function box(w: number, h: number, d: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addLamp(group: THREE.Group, x: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const pole = box(0.1, 4, 0.1, matPole);
  pole.position.y = 2;

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 12, 12),
    new THREE.MeshBasicMaterial({
      color: 0xffc070,
      transparent: true,
      opacity: 0.28,
      toneMapped: false,
    }),
  );
  glow.position.y = 4.1;

  const bulb = box(0.28, 0.16, 0.28, matLamp);
  bulb.position.y = 4.1;

  const light = new THREE.PointLight(0xffb870, 2.4, 26, 2);
  light.position.set(0, 4.2, 0);

  g.add(pole, glow, bulb, light);
  group.add(g);
}

export function createScatterProps(scene: THREE.Scene): ScatterPropsHandle {
  const root = new THREE.Group();
  scene.add(root);

  const edge = FLOOR_SIZE / 2 - 3;
  const buildings: [number, number, number, number][] = [
    [-edge + 4, -edge + 5, 7, 5],
    [edge - 8, -edge + 4, 9, 6],
    [-edge + 5, edge - 8, 6, 9],
    [edge - 10, edge - 6, 10, 5],
    [0, -edge + 6, 12, 4],
    [-edge + 8, 0, 5, 12],
    [edge - 5, 10, 6, 7],
    [-15, 18, 8, 6],
  ];

  for (const [x, z, w, d] of buildings) {
    const h = 7 + Math.random() * 5;
    const b = box(w, h, d, matBuilding);
    b.position.set(x, h / 2, z);
    root.add(b);
  }

  const lampPositions: [number, number][] = [
    [0, -14],
    [0, -28],
    [14, -20],
    [30, -26],
    [-12, 10],
    [-24, 24],
    [18, 8],
    [-20, -12],
    [22, -8],
    [-8, 18],
    [8, -35],
    [-18, -18],
    [-32, 8],
    [22, 12],
    [-24, 28],
    [35, -20],
    [-5, -32],
  ];
  for (const [x, z] of lampPositions) addLamp(root, x, z);

  const bench = box(2, 0.45, 0.8, matBench);
  bench.position.set(-14, 0.22, 10);
  root.add(bench);

  const first = QUEST_CHAIN[0];
  const questMarker = new THREE.Mesh(
    new THREE.RingGeometry(0.6, 1, 32),
    new THREE.MeshBasicMaterial({
      color: 0xc97b9a,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    }),
  );
  questMarker.rotation.x = -Math.PI / 2;
  questMarker.position.y = 0.06;

  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8),
    new THREE.MeshBasicMaterial({ color: 0xc97b9a, transparent: true, opacity: 0.4 }),
  );
  pillar.position.y = 1.25;

  const markerGroup = new THREE.Group();
  markerGroup.position.set(first.targetX, 0, first.targetZ);
  markerGroup.add(questMarker, pillar);
  root.add(markerGroup);

  return {
    questMarker: markerGroup,
    setQuestTarget(x, z) {
      markerGroup.position.set(x, 0, z);
    },
    dispose: () => {
      scene.remove(root);
      root.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    },
  };
}
