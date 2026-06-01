import * as THREE from "three";

export type NpcOptions = {
  talkLabel?: string;
  dialogueId?: string;
  bodyColor?: number;
  emissive?: number;
};

export class Npc {
  readonly root = new THREE.Group();
  readonly talkLabel: string;
  readonly dialogueId: string;

  constructor(
    scene: THREE.Scene,
    x: number,
    z: number,
    options: NpcOptions = {},
  ) {
    this.talkLabel = options.talkLabel ?? "대화하기 [E]";
    this.dialogueId = options.dialogueId ?? "npc_intro";
    this.root.position.set(x, 0, z);

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.35, 1.1, 6, 12),
      new THREE.MeshStandardMaterial({
        color: options.bodyColor ?? 0x5a4a6a,
        emissive: options.emissive ?? 0x2a1a3a,
        emissiveIntensity: 0.35,
      }),
    );
    body.position.y = 1.1;
    body.castShadow = true;

    const hood = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x1a1525 }),
    );
    hood.position.y = 2.05;

    this.root.add(body, hood);
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
