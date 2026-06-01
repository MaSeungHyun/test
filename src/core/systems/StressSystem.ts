import { STRESS_HIGH, STRESS_MAX } from "@/core/constants";

export class StressSystem {
  value = 22;

  update(delta: number, isMoving: boolean, isRunning: boolean, resting: boolean) {
    if (resting) {
      this.value = Math.max(0, this.value - delta * 14);
      return;
    }
    if (!isMoving) {
      this.value = Math.max(0, this.value - delta * 2.5);
      return;
    }
    const rate = isRunning ? 4.5 : 1.6;
    this.value = Math.min(STRESS_MAX, this.value + delta * rate);
  }

  get isHigh() {
    return this.value >= STRESS_HIGH;
  }

  get normalized() {
    return this.value / STRESS_MAX;
  }
}
