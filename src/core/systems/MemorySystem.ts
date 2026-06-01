import { MEMORY_SPOTS, type MemorySpot } from "@/data/memories";

export type MemoryEntry = { id: string; title: string };

export class MemorySystem {
  private found = new Set<string>();

  update(
    x: number,
    z: number,
    onDiscover: (spot: MemorySpot) => void,
    blocked: boolean,
  ): void {
    if (blocked) return;

    for (const spot of MEMORY_SPOTS) {
      if (this.found.has(spot.id)) continue;
      const dx = x - spot.x;
      const dz = z - spot.z;
      if (Math.hypot(dx, dz) <= spot.radius) {
        this.found.add(spot.id);
        onDiscover(spot);
      }
    }
  }

  get entries(): MemoryEntry[] {
    return MEMORY_SPOTS.filter((s) => this.found.has(s.id)).map((s) => ({
      id: s.id,
      title: s.title,
    }));
  }

  get count() {
    return this.found.size;
  }

  get total() {
    return MEMORY_SPOTS.length;
  }

  serialize() {
    return [...this.found];
  }

  load(ids: string[] | undefined) {
    if (!ids) return;
    for (const id of ids) this.found.add(id);
  }
}
