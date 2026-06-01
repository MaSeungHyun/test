type Props = {
  title: string;
  text: string;
  onRestart: () => void;
};

export function EndingScreen({ title, text, onRestart }: Props) {
  return (
    <div className="game-ending">
      <h1>{title}</h1>
      <p>{text}</p>
      <button type="button" onClick={onRestart}>
        처음부터
      </button>
    </div>
  );
}
