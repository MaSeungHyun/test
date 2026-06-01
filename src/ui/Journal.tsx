import type { JournalState } from "@/core/ui/bridge";

type Props = {
  journal: JournalState | null;
};

export function Journal({ journal }: Props) {
  if (!journal) return null;

  return (
    <div className="game-journal">
      <div className="game-journal__title">기억 조각</div>
      <div className="game-journal__count">
        {journal.found} / {journal.total}
      </div>
      {journal.recentTitle && (
        <div className="game-journal__recent">+ {journal.recentTitle}</div>
      )}
    </div>
  );
}
