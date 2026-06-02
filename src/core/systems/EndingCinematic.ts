import * as THREE from "three";
import type { PerspectiveCamera } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Character } from "@/core/entities/Character";
import {
  CAMERA_FOCUS_HEIGHT,
  ROOF_EDGE_X,
  ROOF_EDGE_Z,
  ROOF_PLATFORM_Y,
} from "@/core/constants";

type Phase = "idle" | "edge" | "fall" | "impact" | "done";

const GRAVITY = 28;
const FALL_FORWARD = 0.35;

export class EndingCinematic {
  active = false;
  private phase: Phase = "idle";
  private timer = 0;
  private fallVelocity = 0;
  private character: Character | null = null;
  private camera: PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;
  private camPos = new THREE.Vector3();
  private lookAt = new THREE.Vector3();
  private edgeDir = new THREE.Vector3();

  start(
    character: Character,
    camera: PerspectiveCamera,
    controls: OrbitControls,
  ): void {
    this.character = character;
    this.camera = camera;
    this.controls = controls;
    this.active = true;
    this.phase = "edge";
    this.timer = 0;
    this.fallVelocity = 0;

    controls.enabled = false;
    character.movementEnabled = false;
    character.stopAnimationsForCinematic();

    const root = character.root;
    root.position.set(ROOF_EDGE_X, ROOF_PLATFORM_Y, ROOF_EDGE_Z);
    this.edgeDir.set(0.4, 0, 0.92).normalize();
    root.rotation.set(0, Math.atan2(this.edgeDir.x, this.edgeDir.z), 0);

    this.camPos.set(ROOF_EDGE_X - 5, ROOF_PLATFORM_Y + 3, ROOF_EDGE_Z + 7);
    camera.position.copy(this.camPos);
    this.lookAt.set(ROOF_EDGE_X, ROOF_PLATFORM_Y + 1.2, ROOF_EDGE_Z);
    camera.lookAt(this.lookAt);
  }

  update(delta: number): boolean {
    if (!this.active || !this.character || !this.camera) return false;

    const root = this.character.root;
    this.timer += delta;

    if (this.phase === "edge") {
      const t = Math.min(1, this.timer / 1.4);
      root.position.x = THREE.MathUtils.lerp(
        ROOF_EDGE_X,
        ROOF_EDGE_X + this.edgeDir.x * 1.1,
        t,
      );
      root.position.z = THREE.MathUtils.lerp(
        ROOF_EDGE_Z,
        ROOF_EDGE_Z + this.edgeDir.z * 1.1,
        t,
      );
      root.rotation.x = THREE.MathUtils.lerp(0, 0.15, t);

      if (t >= 1) {
        this.phase = "fall";
        this.timer = 0;
        this.fallVelocity = 0.5;
      }
    } else if (this.phase === "fall") {
      this.fallVelocity += GRAVITY * delta;
      root.position.y -= this.fallVelocity * delta;
      root.position.x += this.edgeDir.x * FALL_FORWARD * delta;
      root.position.z += this.edgeDir.z * FALL_FORWARD * delta;
      root.rotation.x = THREE.MathUtils.lerp(
        root.rotation.x,
        Math.PI * 0.42,
        delta * 2.2,
      );
      root.rotation.z = Math.sin(this.timer * 4) * 0.08;

      if (root.position.y <= 0) {
        root.position.y = 0;
        this.phase = "impact";
        this.timer = 0;
        root.rotation.x = Math.PI * 0.5;
        root.rotation.z = 0;
      }
    } else if (this.phase === "impact") {
      if (this.timer >= 1.2) {
        this.phase = "done";
      }
    } else if (this.phase === "done") {
      this.active = false;
      return false;
    }

    this.updateCamera();
    return true;
  }

  private updateCamera(): void {
    if (!this.character || !this.camera) return;
    const root = this.character.root;
    const target = this.lookAt.set(
      root.position.x,
      root.position.y + CAMERA_FOCUS_HEIGHT,
      root.position.z,
    );
    const desired = this.camPos.set(
      root.position.x - 4.5,
      root.position.y + 3.5,
      root.position.z + 6,
    );
    this.camera.position.lerp(desired, 0.06);
    this.camera.lookAt(target);
  }

  dispose(): void {
    this.controls && (this.controls.enabled = true);
    this.active = false;
    this.phase = "idle";
    this.character = null;
    this.camera = null;
    this.controls = null;
  }
}
