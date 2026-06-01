export type QuestStep = {
  id: string;
  title: string;
  description: string;
  targetX: number;
  targetZ: number;
  radius: number;
};

export const QUEST_CHAIN: QuestStep[] = [
  {
    id: "lamp_north",
    title: "첫 번째 불빛",
    description: "북쪽 골목 가로등 아래로 걸어가기",
    targetX: 0,
    targetZ: -28,
    radius: 4,
  },
  {
    id: "cross_east",
    title: "버려진 신호",
    description: "동쪽 끝 작은 표식까지 이어서 걷기",
    targetX: 30,
    targetZ: -26,
    radius: 4,
  },
  {
    id: "bridge",
    title: "다리 위",
    description: "중앙 북쪽 다리 표식 — 바람이 차다",
    targetX: -18,
    targetZ: -18,
    radius: 4,
  },
  {
    id: "shrine",
    title: "낡은 신사",
    description: "서쪽 골목 끝 작은 제단에 다가가기",
    targetX: -32,
    targetZ: 8,
    radius: 4,
  },
  {
    id: "fountain",
    title: "멈춘 분수",
    description: "북동쪽 분수대 표식을 찾기",
    targetX: 22,
    targetZ: 12,
    radius: 4,
  },
  {
    id: "dawn_mark",
    title: "새벽의 끝",
    description: "남서쪽 큰 표식에 닿기 — 밤이 조금씩 길어진다",
    targetX: -24,
    targetZ: 28,
    radius: 5,
  },
];
