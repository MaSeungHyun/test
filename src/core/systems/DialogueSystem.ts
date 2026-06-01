import { DIALOGUES } from "@/data/dialogues";
import type { DialogueState, GameUiBridge } from "@/core/ui/bridge";

export class DialogueSystem {
  active = false;
  private nodeId: string | null = null;
  private talkedToNpc = false;

  get hasTalkedToNpc() {
    return this.talkedToNpc;
  }

  start(nodeId: string, ui: GameUiBridge) {
    this.nodeId = nodeId;
    this.active = true;
    if (nodeId.startsWith("npc")) this.talkedToNpc = true;
    this.showCurrent(ui);
  }

  choose(choiceId: string, ui: GameUiBridge) {
    const node = this.nodeId ? DIALOGUES[this.nodeId] : null;
    const nextId = node?.onChoice?.[choiceId];
    if (nextId) {
      this.nodeId = nextId;
      this.showCurrent(ui);
    } else {
      this.close(ui);
    }
  }

  advance(ui: GameUiBridge) {
    const node = this.nodeId ? DIALOGUES[this.nodeId] : null;
    if (node?.next) {
      this.nodeId = node.next;
      this.showCurrent(ui);
    } else {
      this.close(ui);
    }
  }

  close(ui: GameUiBridge) {
    this.active = false;
    this.nodeId = null;
    ui.onDialogue(null);
  }

  private showCurrent(ui: GameUiBridge) {
    const node = this.nodeId ? DIALOGUES[this.nodeId] : null;
    if (!node || !node.text || node.text === "…") {
      this.close(ui);
      return;
    }
    const state: DialogueState = {
      speaker: node.speaker,
      text: node.text,
      choices: node.choices,
    };
    ui.onDialogue(state);
  }

  serialize() {
    return { talkedToNpc: this.talkedToNpc };
  }

  load(data: { talkedToNpc?: boolean }) {
    this.talkedToNpc = Boolean(data.talkedToNpc);
  }
}
