import * as THREE from "three";
import { INTERACT_RADIUS, NPC_TALK_RADIUS } from "@/core/constants";
import type { Interactable } from "@/core/entities/Interactable";
import type { Npc } from "@/core/entities/Npc";

export type NearbyTarget =
  | { kind: "npc"; npc: Npc; label: string }
  | { kind: "object"; object: Interactable };

export class InteractionSystem {
  resting = false;
  private restTimer = 0;

  findNearby(
    position: THREE.Vector3,
    npcs: Npc[],
    objects: Interactable[],
  ): NearbyTarget | null {
    let closestNpc: Npc | null = null;
    let closestNpcDist = NPC_TALK_RADIUS;

    for (const npc of npcs) {
      const d = position.distanceTo(npc.root.position);
      if (d < closestNpcDist) {
        closestNpcDist = d;
        closestNpc = npc;
      }
    }

    if (closestNpc) {
      return {
        kind: "npc",
        npc: closestNpc,
        label: closestNpc.talkLabel,
      };
    }

    let best: Interactable | null = null;
    let bestDist = INTERACT_RADIUS;
    for (const obj of objects) {
      const d = position.distanceTo(obj.root.position);
      if (d < bestDist) {
        bestDist = d;
        best = obj;
      }
    }
    if (best) return { kind: "object", object: best };
    return null;
  }

  startRest(duration: number) {
    this.resting = true;
    this.restTimer = duration;
  }

  updateRest(delta: number) {
    if (!this.resting) return;
    this.restTimer -= delta;
    if (this.restTimer <= 0) this.resting = false;
  }
}
