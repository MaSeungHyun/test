import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  ANIM_RUNNING,
  ANIM_WALKING_WOMAN,
  FLOOR_SIZE,
  MOVE_SPEED,
  RUN_SPEED,
} from "@/core/constants";

const TARGET_HEIGHT = 1.6;
const ANIM_FADE = 0.2;

const moveDir = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();

export class Character {
  readonly root = new THREE.Group();
  readonly height = TARGET_HEIGHT;

  private mixer: THREE.AnimationMixer | null = null;
  private actions = new Map<string, THREE.AnimationAction>();
  private activeAction: THREE.AnimationAction | null = null;
  private loadPromise: Promise<void> | null = null;
  movementEnabled = true;

  load(modelUrl: string): Promise<void> {
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? TARGET_HEIGHT / maxDim : 1;
          model.scale.setScalar(scale);

          const centered = new THREE.Box3().setFromObject(model);
          model.position.y = -centered.min.y;
          this.root.add(model);

          this.mixer = new THREE.AnimationMixer(model);
          for (const clip of gltf.animations) {
            const action = this.mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            this.actions.set(clip.name, action);
          }

          resolve();
        },
        undefined,
        reject,
      );
    });

    return this.loadPromise;
  }

  setPosition(x: number, z: number) {
    this.root.position.set(x, 0, z);
  }

  updateMovement(
    keys: ReadonlySet<string>,
    camera: THREE.Camera,
    delta: number,
    isRunning: boolean,
  ): void {
    if (!this.movementEnabled) return;

    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() === 0) {
      forward.set(0, 0, -1);
    } else {
      forward.normalize();
    }

    right.crossVectors(forward, THREE.Object3D.DEFAULT_UP).normalize();

    moveDir.set(0, 0, 0);
    if (keys.has("KeyW")) moveDir.add(forward);
    if (keys.has("KeyS")) moveDir.sub(forward);
    if (keys.has("KeyA")) moveDir.sub(right);
    if (keys.has("KeyD")) moveDir.add(right);

    if (moveDir.lengthSq() === 0) return;

    const speed = isRunning ? RUN_SPEED : MOVE_SPEED;
    moveDir.normalize().multiplyScalar(speed * delta);
    this.root.position.add(moveDir);

    const limit = FLOOR_SIZE / 2 - 1.2;
    this.root.position.x = THREE.MathUtils.clamp(
      this.root.position.x,
      -limit,
      limit,
    );
    this.root.position.z = THREE.MathUtils.clamp(
      this.root.position.z,
      -limit,
      limit,
    );
    this.root.rotation.y = Math.atan2(moveDir.x, moveDir.z);
  }

  updateAnimation(delta: number, isMoving: boolean, isRunning: boolean): void {
    if (!this.mixer) return;

    if (!isMoving || !this.movementEnabled) {
      this.stopAllAnimations();
      this.mixer.update(delta);
      return;
    }

    const clipName = isRunning ? ANIM_RUNNING : ANIM_WALKING_WOMAN;
    const next = this.actions.get(clipName);
    if (next) this.fadeToAction(next, ANIM_FADE);
    this.mixer.update(delta);
  }

  private fadeToAction(next: THREE.AnimationAction, duration: number): void {
    if (this.activeAction === next) return;
    this.activeAction?.fadeOut(duration);
    this.activeAction = next;
    next.reset().setEffectiveWeight(1).fadeIn(duration).play();
  }

  private stopAllAnimations(): void {
    if (!this.activeAction) return;
    for (const action of this.actions.values()) action.stop();
    this.activeAction = null;
  }
}
