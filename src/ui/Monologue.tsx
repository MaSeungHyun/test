type Props = { text: string | null };

export function Monologue({ text }: Props) {
  if (!text) return null;
  return <div className="game-monologue">{text}</div>;
}
