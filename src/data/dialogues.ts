import type { DialogueState } from "@/core/ui/bridge";

export type DialogueNode = DialogueState & {
  next?: string;
  onChoice?: Record<string, string>;
};

export const DIALOGUES: Record<string, DialogueNode> = {
  npc_intro: {
    speaker: "낯선 사람",
    text: "…밤이 길네. 괜찮아 보이지 않는데.",
    choices: [
      { id: "ok", label: "괜찮아요." },
      { id: "tired", label: "…피곤해요." },
      { id: "leave", label: "그냥 갈게요." },
    ],
    onChoice: {
      ok: "npc_ok",
      tired: "npc_tired",
      leave: "npc_bye",
    },
  },
  npc_ok: {
    speaker: "낯선 사람",
    text: "그래. 거짓말도 위로가 되긴 하지. 이 거리 끝에 표식이 있대. …가보지 그래.",
    next: "npc_bye",
  },
  npc_tired: {
    speaker: "낯선 사람",
    text: "쉬어. 벤치도 있고, 분수대도 있어. 여기서 쓰러지진 말고.",
    next: "npc_bye",
  },
  npc2_intro: {
    speaker: "음치락인",
    text: "너도 안 자는구나. …이 시간엔 다들 그렇지.",
    choices: [
      { id: "why", label: "왜 밖에 있어요?" },
      { id: "same", label: "저도요." },
    ],
    onChoice: {
      why: "npc2_why",
      same: "npc2_same",
    },
  },
  npc2_why: {
    speaker: "음치락인",
    text: "집이 더 시끄러워서. 라디오가 안 꺼져. …여긴 비 소리만 들려.",
    next: "npc2_end",
  },
  npc2_same: {
    speaker: "음치락인",
    text: "그럼 천천히 걸어. 급할수록 밤만 길어져.",
    next: "npc2_end",
  },
  npc2_end: {
    speaker: "음치락인",
    text: "…가봐. 표식이 기다리고 있을 테니.",
    next: undefined,
  },
  phone: {
    speaker: "나",
    text: "읽씹된 메시지가 스물여섯 개. …또 봤네.",
    next: undefined,
  },
  cigarette: {
    speaker: "나",
    text: "연기가 잠깐 머리를 맑게 해줬다. 금방 다시 흐려지지만.",
    next: undefined,
  },
  bench: {
    speaker: "나",
    text: "잠깐 앉자. …숨이 조금 돌아온다.",
    next: undefined,
  },
  vending: {
    speaker: "나",
    text: "따뜻한 커피가 나왔다. 손끝만 잠깐 살아 있는 것 같다.",
    next: undefined,
  },
  mirror: {
    speaker: "나",
    text: "깨진 거울에 얼굴이 여러 개로 쪼개져 있다. …어느 게 나지.",
    next: undefined,
  },
  letter: {
    speaker: "나",
    text: "젖은 봉투. 이름은 지워졌고, 안에는 아무것도 없었다.",
    next: undefined,
  },
  fountain: {
    speaker: "나",
    text: "분수는 오래전에 멈췄다. 물 대신 비만 쌓인다.",
    next: undefined,
  },
  shrine: {
    speaker: "나",
    text: "낡은 제단. 누구 이름도 없다. …기도할 대상이 없어서 오히려 편하다.",
    next: undefined,
  },
};
