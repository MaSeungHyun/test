import { ENDINGS, type EndingDef } from "@/data/endings";
import { STRESS_MAX } from "@/core/constants";

export class EndingSystem {
  triggered = false;
  current: EndingDef | null = null;

  check(
    allQuestsDone: boolean,
    stress: number,
    talkedToNpc: boolean,
    memoryCount: number,
    memoryTotal: number,
  ) {
    if (this.triggered) return this.current;

    if (stress >= STRESS_MAX - 2) {
      this.triggered = true;
      this.current = ENDINGS.void;
      return this.current;
    }

    if (!allQuestsDone) return null;

    const memoriesOk = memoryCount >= Math.min(4, memoryTotal);

    if (talkedToNpc && stress < 45 && memoriesOk) {
      this.triggered = true;
      this.current = ENDINGS.dawn;
      return this.current;
    }

    if (talkedToNpc || memoriesOk) {
      this.triggered = true;
      this.current = ENDINGS.linger;
      return this.current;
    }

    return null;
  }
}
