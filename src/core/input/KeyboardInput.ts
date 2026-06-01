export class KeyboardInput {
  readonly pressedKeys = new Set<string>();
  private interactQueued = false;

  private onKeyDown = (e: KeyboardEvent) => {
    this.pressedKeys.add(e.code);
    if (e.code === "KeyE") this.interactQueued = true;
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.pressedKeys.delete(e.code);
  };

  constructor() {
    globalThis.addEventListener("keydown", this.onKeyDown);
    globalThis.addEventListener("keyup", this.onKeyUp);
  }

  get isRunning(): boolean {
    return (
      this.pressedKeys.has("ShiftLeft") || this.pressedKeys.has("ShiftRight")
    );
  }

  get isMoving(): boolean {
    return (
      this.pressedKeys.has("KeyW") ||
      this.pressedKeys.has("KeyS") ||
      this.pressedKeys.has("KeyA") ||
      this.pressedKeys.has("KeyD")
    );
  }

  consumeInteract(): boolean {
    if (!this.interactQueued) return false;
    this.interactQueued = false;
    return true;
  }

  dispose() {
    globalThis.removeEventListener("keydown", this.onKeyDown);
    globalThis.removeEventListener("keyup", this.onKeyUp);
    this.pressedKeys.clear();
  }
}
