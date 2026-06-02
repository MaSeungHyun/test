import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

function prepareProp(scene: THREE.Object3D, targetHeight: number): THREE.Group {
  const root = new THREE.Group();
  root.add(scene);

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? targetHeight / maxDim : 1;
  root.scale.setScalar(scale);

  const grounded = new THREE.Box3().setFromObject(root);
  root.position.y = -grounded.min.y;

  return root;
}

export function loadPropGlb(
  url: string,
  targetHeight: number,
): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(prepareProp(gltf.scene, targetHeight)),
      undefined,
      reject,
    );
  });
}
