import type { DialogueState } from "@/core/ui/bridge";

export type DialogueNode = DialogueState & {
  next?: string;
  onChoice?: Record<string, string>;
};

export const DIALOGUES: Record<string, DialogueNode> = {
  npc_intro: {
    speaker: "낯선 사람",
    text: "…밤이 길네. 괜찮아 보이지 않는데. 손 떨리는 거, 봤어.",
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
    text:
      "그래. 거짓말도 위로가 되긴 하지. …폰은 계속 보지 말고, 표식이나 따라가. " +
      "이 거리 끝에 옥상이 있대.",
    next: "npc_bye",
  },
  npc_tired: {
    speaker: "낯선 사람",
    text: "쉬어. 벤치도 있고, 분수대도 있어. 여기서 쓰러지진 말고. …난간은 위험해.",
    next: "npc_bye",
  },
  npc_bye: {
    speaker: "낯선 사람",
    text: "…천천히 가. 밤은 길지만, 아침은 온다고들 하더라.",
    next: undefined,
  },
  npc2_intro: {
    speaker: "음침한 목소리",
    text: "너도 안 자는구나. …이 시간엔 다들 그렇지. 집에 가기 싫은 사람들.",
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
    speaker: "음침한 목소리",
    text:
      "집이 더 시끄러워서. 라디오가 안 꺼져. …그 사람이 또 전화했어. " +
      "여긴 비 소리만 들려. 그게 나은 날도 있어.",
    next: "npc2_end",
  },
  npc2_same: {
    speaker: "음침한 목소리",
    text: "그럼 천천히 걸어. 급할수록 밤만 길어져. …옥상은 혼자 가지 마.",
    next: "npc2_end",
  },
  npc2_end: {
    speaker: "음침한 목소리",
    text: "…가봐. 표식이 기다리고 있을 테니.",
    next: undefined,
  },
  phone: {
    speaker: "나",
    text:
      "읽씹된 메시지가 스물여섯 개. …또 봤네. " +
      "‘미안해’ ‘지금 어디야’ ‘제발 받아’ — 답장 칸에 손가락이 멈춘다. " +
      "내면 또 싸울 것 같고, 안내면 더 무서워서.",
    next: undefined,
  },
  cigarette: {
    speaker: "나",
    text:
      "연기가 잠깐 머리를 맑게 해줬다. 금방 다시 흐려지지만. " +
      "담배갑 뒷면에 적힌 숫자. …그 사람이 좋아하던 브랜드다.",
    next: undefined,
  },
  bench: {
    speaker: "나",
    text:
      "잠깐 앉자. …숨이 조금 돌아온다. " +
      "벤치 맞은편 옥상에 불빛이 보인다. 저기까지 가야 할까, 아니면 여기서 멈출까.",
    next: undefined,
  },
  vending: {
    speaker: "나",
    text:
      "따뜻한 커피가 나왔다. 손끝만 잠깐 살아 있는 것 같다. " +
      "캔에 적힌 ‘당신을 위한 밤’ — 웃기지도 않게, 눈물이 날 뻔했다.",
    next: undefined,
  },
  mirror: {
    speaker: "나",
    text:
      "깨진 거울에 얼굴이 여러 개로 쪼개져 있다. …어느 게 나지. " +
      "가운데 얼굴만 웃고 있는 것 같아서, 거울에서 눈을 떼었다.",
    next: undefined,
  },
  letter: {
    speaker: "나",
    text:
      "젖은 봉투. 이름은 지워졌고, 안에는 아무것도 없었다. " +
      "…비워 둔 편지. 받을 사람이 없어진 것 같다.",
    next: undefined,
  },
  fountain: {
    speaker: "나",
    text:
      "분수는 오래전에 멈췄다. 물 대신 비만 쌓인다. " +
      "바닥에 누군가 ‘여기까지’라고 썼다가, 빗물에 번져 사라졌다.",
    next: undefined,
  },
  shrine: {
    speaker: "나",
    text:
      "낡은 제단. 누구 이름도 없다. …기도할 대상이 없어서 오히려 편하다. " +
      "그 대신, 잊고 싶은 이름만 떠오른다.",
    next: undefined,
  },
};
