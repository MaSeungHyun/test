export type EndingCinematic = "fall" | "none";

export type EndingDef = {
  id: string;
  title: string;
  text: string;
  cinematic: EndingCinematic;
};

export const ENDINGS = {
  dawn: {
    id: "dawn",
    title: "새벽",
    cinematic: "none",
    text:
      "마지막 표식에 손을 댔을 때, 하늘이 아주 조금 밝아졌다. " +
      "폰에는 여전히 읽지 않은 메시지가 있지만, 오늘은 답하지 않아도 될 것 같다. " +
      "비가 그칠 때까지, 천천히 집 쪽으로 돌아선다.",
  },
  void: {
    id: "void",
    title: "낙하",
    cinematic: "fall",
    text:
      "옥상 난간 너머로 몸이 떨어지는 동안, 바람만 귓가를 스쳤다. " +
      "땅에 닿기 직전, 누군가 이름을 불렀던 것 같기도 했다. " +
      "…그다음은, 기억하고 싶지 않다.",
  },
  linger: {
    id: "linger",
    title: "머무름",
    cinematic: "none",
    text:
      "밤은 끝나지 않았다. 표식은 다 찍었지만, 하늘은 여전히 어둡다. " +
      "그래도 발은 앞으로 간다. 멈추면 더 무거워질 테니까.",
  },
} as const satisfies Record<string, EndingDef>;
