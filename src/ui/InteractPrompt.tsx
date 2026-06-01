type Props = { visible: boolean; label?: string };

export function InteractPrompt({ visible, label }: Props) {
  if (!visible || !label) return null;
  return <div className="game-prompt">{label}</div>;
}
