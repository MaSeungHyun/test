import bgmUrl from "@/assets/bgm.mp3";

export class Bgm {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio(bgmUrl);
    this.audio.loop = true;
    this.audio.volume = 1.0;
    this.audio.preload = "auto";
  }

  play() {
    if (!this.audio.paused) return;

    void this.audio.play().catch(() => {
      // 브라우저 자동재생 정책 — 첫 클릭/키 입력 후 재시도됨
    });
  }

  dispose() {
    this.audio.pause();
    this.audio.src = "";
  }
}
