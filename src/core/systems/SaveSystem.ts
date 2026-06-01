import { SAVE_KEY } from "@/core/constants";

export type SaveData = {
  x: number;
  z: number;
  stress: number;
  questStage?: number;
  questCompleted?: boolean;
  talkedToNpc: boolean;
  memories?: string[];
  flags: string[];
};

export class SaveSystem {
  load(): Partial<SaveData> | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SaveData;
    } catch {
      return null;
    }
  }

  save(data: SaveData) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }
}
