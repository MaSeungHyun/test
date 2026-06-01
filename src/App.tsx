import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Game } from "@/core/Game";
import type {
  DialogueState,
  GameUiBridge,
  JournalState,
  MinimapState,
  QuestUiState,
} from "@/core/ui/bridge";
import { QUEST_CHAIN } from "@/data/quests";
import { Dialogue } from "@/ui/Dialogue";
import { EndingScreen } from "@/ui/EndingScreen";
import { Hud } from "@/ui/Hud";
import { InteractPrompt } from "@/ui/InteractPrompt";
import { Journal } from "@/ui/Journal";
import { Minimap } from "@/ui/Minimap";
import { Monologue } from "@/ui/Monologue";

const defaultQuest: QuestUiState = {
  title: `${QUEST_CHAIN[0].title} (1/${QUEST_CHAIN.length})`,
  description: QUEST_CHAIN[0].description,
  completed: false,
  progress: `0/${QUEST_CHAIN.length}`,
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  const [stress, setStress] = useState(28);
  const [quest, setQuest] = useState<QuestUiState>(defaultQuest);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [monologue, setMonologue] = useState<string | null>(null);
  const [ending, setEnding] = useState<{
    id: string;
    title: string;
    text: string;
  } | null>(null);
  const [prompt, setPrompt] = useState({ visible: false, label: "" });
  const [timeLabel, setTimeLabel] = useState("새벽 3:17");
  const [glitch, setGlitch] = useState(false);
  const [minimap, setMinimap] = useState<MinimapState | null>(null);
  const [journal, setJournal] = useState<JournalState | null>(null);

  const bridge: GameUiBridge = useMemo(
    () => ({
      onStressChange: setStress,
      onQuestUpdate: setQuest,
      onDialogue: setDialogue,
      onMonologue: setMonologue,
      onEnding: setEnding,
      onInteractPrompt: (visible, label) =>
        setPrompt({ visible, label: label ?? "" }),
      onGlitch: setGlitch,
      onTimeLabel: setTimeLabel,
      onMinimapUpdate: setMinimap,
      onJournalUpdate: setJournal,
    }),
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const gamePromise = Game.create(container, bridge);

    void gamePromise
      .then((instance) => {
        if (!active) {
          instance.dispose();
          return;
        }
        gameRef.current = instance;
      })
      .catch((err) => {
        console.error("게임 초기화 실패:", err);
      });

    return () => {
      active = false;
      gameRef.current?.dispose();
      gameRef.current = null;
    };
  }, [bridge]);

  const onChoice = useCallback((id: string) => {
    gameRef.current?.handleDialogueChoice(id);
  }, []);

  const onAdvance = useCallback(() => {
    gameRef.current?.handleDialogueAdvance();
  }, []);

  const onRestart = useCallback(() => {
    gameRef.current?.restart();
  }, []);

  return (
    <div className={`game-shell ${glitch ? "game-shell--glitch" : ""}`}>
      <div ref={containerRef} className="game-view" />
      <Hud stress={stress} quest={quest} timeLabel={timeLabel} />
      <Minimap state={minimap} />
      <Journal journal={journal} />
      <Monologue text={monologue} />
      <InteractPrompt visible={prompt.visible} label={prompt.label} />
      {dialogue && (
        <Dialogue
          dialogue={dialogue}
          onChoice={onChoice}
          onAdvance={onAdvance}
        />
      )}
      {ending && (
        <EndingScreen
          title={ending.title}
          text={ending.text}
          onRestart={onRestart}
        />
      )}
      <div className="game-vignette" aria-hidden />
    </div>
  );
}

export default App;
