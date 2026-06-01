export type MemorySpot = {
  id: string;
  title: string;
  text: string;
  x: number;
  z: number;
  radius: number;
};

export const MEMORY_SPOTS: MemorySpot[] = [
  {
    id: "puddle",
    title: "웅덩이",
    text: "비 웅덩이에 가로등이 두 개 비친다. …어느 쪽이 진짜일까.",
    x: 12,
    z: 6,
    radius: 2.8,
  },
  {
    id: "graffiti",
    title: "낙서",
    text: "벽에 누군가 쓴 글씨. ‘괜찮아’ — 지워지지 않았다.",
    x: -20,
    z: -6,
    radius: 2.8,
  },
  {
    id: "cat",
    title: "고양이",
    text: "길고양이가 나를 보다가, 먼저視線을 돌렸다.",
    x: 8,
    z: -18,
    radius: 2.5,
  },
  {
    id: "flower",
    title: "쓰러진 꽃",
    text: "보라색 꽃이 하나. 아무도 꺾지 않은 채로 시들어 있다.",
    x: -28,
    z: 18,
    radius: 2.5,
  },
  {
    id: "window",
    title: "불 켜진 창",
    text: "커튼 사이로 TV 빛이 새어 나온다. 누군가 아직 안 잤구나.",
    x: 26,
    z: -8,
    radius: 2.8,
  },
  {
    id: "rail",
    title: "난간",
    text: "난간에 손을 올렸다. 차갑다. …나도 그렇구나.",
    x: 0,
    z: 14,
    radius: 2.5,
  },
];
