import * as THREE from "three";

export type InteractableType =
  | "bench"
  | "phone"
  | "cigarette"
  | "vending"
  | "mirror"
  | "letter"
  | "fountain"
  | "shrine";

type InteractableConfig = {
  label: string;
  dialogueId: string;
  restSeconds: number;
  color: number;
  emissive?: number;
  buildMesh: () => THREE.Object3D;
};

const CONFIGS: Record<InteractableType, InteractableConfig> = {
  bench: {
    label: "벤치에 앉기 [E]",
    dialogueId: "bench",
    restSeconds: 5,
    color: 0x2a2238,
    buildMesh: () => {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0x2a2238 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.55), mat);
      seat.position.y = 0.5;
      g.add(seat);
      return g;
    },
  },
  phone: {
    label: "휴대폰 보기 [E]",
    dialogueId: "phone",
    restSeconds: 0,
    color: 0x4a6a8a,
    emissive: 0x224466,
    buildMesh: () => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x4a6a8a,
        emissive: 0x224466,
        emissiveIntensity: 0.5,
      });
      const booth = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.7, 0.28), mat);
      booth.position.y = 0.85;
      return booth;
    },
  },
  cigarette: {
    label: "담배 [E]",
    dialogueId: "cigarette",
    restSeconds: 0,
    color: 0x3a3048,
    buildMesh: () => {
      const mat = new THREE.MeshStandardMaterial({ color: 0x3a3048 });
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.08), mat);
      pack.position.y = 0.9;
      return pack;
    },
  },
  vending: {
    label: "자판기 [E]",
    dialogueId: "vending",
    restSeconds: 0,
    color: 0x3d4a5a,
    emissive: 0x1a3040,
    buildMesh: () => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x3d4a5a,
        emissive: 0x336688,
        emissiveIntensity: 0.35,
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.9, 0.7), mat);
      body.position.y = 0.95;
      return body;
    },
  },
  mirror: {
    label: "거울 [E]",
    dialogueId: "mirror",
    restSeconds: 0,
    color: 0x6a7a8a,
    emissive: 0x334455,
    buildMesh: () => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x8899aa,
        emissive: 0x445566,
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.2,
      });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.4), mat);
      m.position.y = 1.1;
      return m;
    },
  },
  letter: {
    label: "편지 [E]",
    dialogueId: "letter",
    restSeconds: 0,
    color: 0x4a4058,
    buildMesh: () => {
      const mat = new THREE.MeshStandardMaterial({ color: 0x5a5068 });
      const env = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 0.5), mat);
      env.position.y = 0.55;
      return env;
    },
  },
  fountain: {
    label: "분수대 [E]",
    dialogueId: "fountain",
    restSeconds: 3,
    color: 0x2a3548,
    buildMesh: () => {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0x2a3548 });
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.4, 0.4, 12),
        mat,
      );
      base.position.y = 0.2;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8),
        mat,
      );
      pillar.position.y = 0.9;
      g.add(base, pillar);
      return g;
    },
  },
  shrine: {
    label: "제단 [E]",
    dialogueId: "shrine",
    restSeconds: 4,
    color: 0x3a2838,
    emissive: 0x2a1525,
    buildMesh: () => {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: 0x3a2838,
        emissive: 0x4a2535,
        emissiveIntensity: 0.3,
      });
      const stone = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.8), mat);
      stone.position.y = 0.35;
      const torii = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.12), mat);
      torii.position.y = 1.2;
      g.add(stone, torii);
      return g;
    },
  },
};

export class Interactable {
  readonly root = new THREE.Group();
  readonly label: string;
  readonly dialogueId: string;
  readonly restSeconds: number;

  constructor(
    type: InteractableType,
    x: number,
    z: number,
    scene: THREE.Scene,
  ) {
    const cfg = CONFIGS[type];
    this.label = cfg.label;
    this.dialogueId = cfg.dialogueId;
    this.restSeconds = cfg.restSeconds;
    this.root.position.set(x, 0, z);

    const mesh = cfg.buildMesh();
    mesh.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
    this.root.add(mesh);

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({
        color: 0xc97b9a,
        transparent: true,
        opacity: 0.45,
      }),
    );
    marker.position.y = 1.4;
    this.root.add(marker);
    scene.add(this.root);
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.root);
    this.root.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.geometry.dispose();
        (c.material as THREE.Material).dispose();
      }
    });
  }
}
