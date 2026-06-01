import type { PerspectiveCamera, WebGLRenderer } from "three";

export type ViewportSize = {
  width: number;
  height: number;
  aspect: number;
};

/** 컨테이너 크기에 맞춰 카메라·렌더러 비율 동기화 (왜곡 없음) */
export function resizeViewport(
  container: HTMLElement,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
): ViewportSize {
  const width = Math.max(1, container.clientWidth);
  const height = Math.max(1, container.clientHeight);
  const aspect = width / height;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);

  return { width, height, aspect };
}
