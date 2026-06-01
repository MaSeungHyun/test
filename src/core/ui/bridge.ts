export type DialogueChoice = {
  id: string;
  label: string;
};

export type DialogueState = {
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
};

export type QuestUiState = {
  title: string;
  description: string;
  completed: boolean;
  progress?: string;
};

export type MinimapState = {
  playerX: number;
  playerZ: number;
  playerRotation: number;
  questX: number;
  questZ: number;
  npcX: number;
  npcZ: number;
};

export type JournalState = {
  found: number;
  total: number;
  recentTitle: string | null;
};

export type GameUiBridge = {
  onStressChange: (value: number) => void;
  onQuestUpdate: (quest: QuestUiState) => void;
  onDialogue: (dialogue: DialogueState | null) => void;
  onMonologue: (text: string | null) => void;
  onEnding: (ending: { id: string; title: string; text: string } | null) => void;
  onInteractPrompt: (visible: boolean, label?: string) => void;
  onGlitch: (active: boolean) => void;
  onTimeLabel: (label: string) => void;
  onMinimapUpdate: (state: MinimapState) => void;
  onJournalUpdate: (state: JournalState) => void;
};

export const noopBridge: GameUiBridge = {
  onStressChange: () => {},
  onQuestUpdate: () => {},
  onDialogue: () => {},
  onMonologue: () => {},
  onEnding: () => {},
  onInteractPrompt: () => {},
  onGlitch: () => {},
  onTimeLabel: () => {},
  onMinimapUpdate: () => {},
  onJournalUpdate: () => {},
};
