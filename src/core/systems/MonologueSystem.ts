import { MONOLOGUES_IDLE, MONOLOGUES_MOVE } from "@/data/monologues";

export class MonologueSystem {
  private cooldown = 12;
  private wasMoving = false;

  update(
    delta: number,
    isMoving: boolean,
    onLine: (text: string) => void,
    blocked: boolean,
  ) {
    if (blocked) return;
    this.cooldown -= delta;

    const changed = isMoving !== this.wasMoving;
    this.wasMoving = isMoving;

    if (!changed || this.cooldown > 0) return;
    this.cooldown = 22 + Math.random() * 18;

    const pool = isMoving ? MONOLOGUES_MOVE : MONOLOGUES_IDLE;
    const line = pool[Math.floor(Math.random() * pool.length)] ?? "";
    onLine(line);
  }
}
