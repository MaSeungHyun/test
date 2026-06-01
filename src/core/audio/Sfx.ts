export class Sfx {
  private wind: OscillatorNode | null = null;
  private windGain: GainNode | null = null;
  private ctx: AudioContext | null = null;
  private footstepTimer = 0;
  private sirenTimer = 18;

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.02;
    this.windGain.connect(this.ctx.destination);
    this.wind = this.ctx.createOscillator();
    this.wind.type = "sine";
    this.wind.frequency.value = 120;
    this.wind.connect(this.windGain);
    this.wind.start();
  }

  resume() {
    void this.ctx?.resume();
  }

  update(delta: number, isMoving: boolean, isRunning: boolean) {
    this.init();
    this.resume();

    if (isMoving) {
      this.footstepTimer -= delta;
      if (this.footstepTimer <= 0) {
        this.playFootstep();
        this.footstepTimer = isRunning ? 0.28 : 0.45;
      }
    }

    this.sirenTimer -= delta;
    if (this.sirenTimer <= 0) {
      this.playSiren();
      this.sirenTimer = 25 + Math.random() * 20;
    }
  }

  private playFootstep() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = 80 + Math.random() * 40;
    gain.gain.value = 0.04;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  private playSiren() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(380, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 1.2);
    gain.gain.value = 0.015;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.6);
  }

  dispose() {
    this.wind?.stop();
    this.wind = null;
    void this.ctx?.close();
    this.ctx = null;
  }
}
