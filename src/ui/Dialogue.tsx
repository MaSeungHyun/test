import type { DialogueState } from "@/core/ui/bridge";

type Props = {
  dialogue: DialogueState;
  onChoice: (id: string) => void;
  onAdvance: () => void;
};

export function Dialogue({ dialogue, onChoice, onAdvance }: Props) {
  return (
    <div className="game-dialogue">
      {dialogue.speaker && (
        <div className="game-dialogue__speaker">{dialogue.speaker}</div>
      )}
      <p className="game-dialogue__text">{dialogue.text}</p>
      {dialogue.choices ? (
        <div className="game-dialogue__choices">
          {dialogue.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChoice(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : (
        <button type="button" className="game-dialogue__next" onClick={onAdvance}>
          …
        </button>
      )}
    </div>
  );
}
