import * as THREE from "three";
import type { Object3D, PerspectiveCamera } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CAMERA_FOCUS_HEIGHT } from "@/core/constants";

/**
 * 캐릭터 이동량만큼 target·camera를 같이 옮겨 Orbit 각도를 유지.
 * (target만 옮기면 WASD 중 마우스 회전이 끊김)
 */
export class OrbitCameraFollow {
  private prevFocus = new THREE.Vector3();
  private focus = new THREE.Vector3();
  private delta = new THREE.Vector3();
  private initialized = false;

  sync(
    target: Object3D,
    camera: PerspectiveCamera,
    controls: OrbitControls,
    focusHeight = CAMERA_FOCUS_HEIGHT,
  ): void {
    this.setFocus(target, focusHeight);
    this.prevFocus.copy(this.focus);
    controls.target.copy(this.focus);
    this.initialized = true;
  }

  update(
    target: Object3D,
    camera: PerspectiveCamera,
    controls: OrbitControls,
    focusHeight = CAMERA_FOCUS_HEIGHT,
  ): void {
    this.setFocus(target, focusHeight);

    if (!this.initialized) {
      this.sync(target, camera, controls, focusHeight);
      return;
    }

    this.delta.subVectors(this.focus, this.prevFocus);
    if (this.delta.lengthSq() > 0) {
      camera.position.add(this.delta);
      controls.target.copy(this.focus);
      this.prevFocus.copy(this.focus);
    } else {
      controls.target.copy(this.focus);
    }
  }

  private setFocus(target: Object3D, focusHeight: number): void {
    this.focus.set(
      target.position.x,
      target.position.y + focusHeight,
      target.position.z,
    );
  }
}
