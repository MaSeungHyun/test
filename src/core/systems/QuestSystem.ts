import { QUEST_CHAIN } from "@/data/quests";
import type { QuestUiState } from "@/core/ui/bridge";

export class QuestSystem {
  /** 완료한 단계 수 (0 ~ QUEST_CHAIN.length) */
  stage = 0;

  get allCompleted(): boolean {
    return this.stage >= QUEST_CHAIN.length;
  }

  get current() {
    return QUEST_CHAIN[Math.min(this.stage, QUEST_CHAIN.length - 1)];
  }

  update(x: number, z: number): boolean {
    if (this.allCompleted) return false;
    const q = QUEST_CHAIN[this.stage];
    const dx = x - q.targetX;
    const dz = z - q.targetZ;
    if (Math.hypot(dx, dz) <= q.radius) {
      this.stage++;
      return true;
    }
    return false;
  }

  toUi(): QuestUiState {
    if (this.allCompleted) {
      return {
        title: "새벽의 끝",
        description: "모든 표식을 찾았다. 이제… 쉬어도 될까.",
        completed: true,
        progress: `${QUEST_CHAIN.length}/${QUEST_CHAIN.length}`,
      };
    }
    const q = this.current;
    return {
      title: `${q.title} (${this.stage + 1}/${QUEST_CHAIN.length})`,
      description: q.description,
      completed: false,
      progress: `${this.stage}/${QUEST_CHAIN.length}`,
    };
  }

  serialize() {
    return { stage: this.stage };
  }

  load(data: { stage?: number; completed?: boolean }) {
    if (data.stage !== undefined) {
      this.stage = Math.min(
        Math.max(0, data.stage),
        QUEST_CHAIN.length,
      );
    } else if (data.completed) {
      this.stage = QUEST_CHAIN.length;
    }
  }
}
