import type { QuestUiState } from "@/core/ui/bridge";

type Props = {
  stress: number;
  quest: QuestUiState;
  timeLabel: string;
};

export function Hud({ stress, quest, timeLabel }: Props) {
  return (
    <div className="game-hud">
      <div className="game-hud__time">{timeLabel}</div>
      <div className="game-hud__stress">
        <span>스트레스</span>
        <div className="game-hud__bar">
          <div
            className="game-hud__bar-fill"
            style={{ width: `${stress}%` }}
          />
        </div>
      </div>
      <div className={`game-hud__quest ${quest.completed ? "done" : ""}`}>
        <strong>{quest.title}</strong>
        {quest.progress && (
          <span className="game-hud__quest-progress">{quest.progress}</span>
        )}
        <p>{quest.description}</p>
        {quest.completed && <span className="game-hud__quest-done">완료</span>}
      </div>
    </div>
  );
}
