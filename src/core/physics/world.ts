import RAPIER from "@dimforge/rapier3d-compat";
import { FLOOR_SIZE } from "@/core/constants";

let ready = false;

export async function initPhysics(): Promise<void> {
  if (!ready) {
    await RAPIER.init();
    ready = true;
  }
}

export function createPhysicsWorld(): RAPIER.World {
  return new RAPIER.World({ x: 0, y: -9.81, z: 0 });
}

function addStaticBox(
  world: RAPIER.World,
  x: number,
  y: number,
  z: number,
  hx: number,
  hy: number,
  hz: number,
) {
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(hx, hy, hz).setTranslation(x, y, z),
    body,
  );
}

export function createMapColliders(world: RAPIER.World): void {
  const half = FLOOR_SIZE / 2;
  const wallH = 5;
  const wallT = 0.5;

  addStaticBox(world, 0, -0.1, 0, half, 0.1, half);
  addStaticBox(world, 0, wallH / 2, -half - wallT, half, wallH / 2, wallT);
  addStaticBox(world, 0, wallH / 2, half + wallT, half, wallH / 2, wallT);
  addStaticBox(world, -half - wallT, wallH / 2, 0, wallT, wallH / 2, half);
  addStaticBox(world, half + wallT, wallH / 2, 0, wallT, wallH / 2, half);
}

export function addPropCollider(
  world: RAPIER.World,
  x: number,
  z: number,
  hx: number,
  hz: number,
  height = 2,
) {
  addStaticBox(world, x, height / 2, z, hx, height / 2, hz);
}
