import { useEffect, useRef } from "react";
import type { MinimapState } from "@/core/ui/bridge";
import { FLOOR_SIZE } from "@/core/constants";

type Props = {
  state: MinimapState | null;
};

const SIZE = 168;
const PAD = 10;

function worldToMap(x: number, z: number, half: number) {
  return {
    u: ((x / half) * 0.5 + 0.5) * (SIZE - PAD * 2) + PAD,
    v: ((z / half) * 0.5 + 0.5) * (SIZE - PAD * 2) + PAD,
  };
}

export function Minimap({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const half = FLOOR_SIZE / 2;
    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.fillStyle = "rgba(10, 6, 18, 0.88)";
    ctx.strokeStyle = "rgba(201, 123, 154, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0, 0, SIZE, SIZE, 8);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(74, 58, 90, 0.5)";
    for (let i = 1; i < 4; i++) {
      const g = PAD + ((SIZE - PAD * 2) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(PAD, g);
      ctx.lineTo(SIZE - PAD, g);
      ctx.moveTo(g, PAD);
      ctx.lineTo(g, SIZE - PAD);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(184, 168, 216, 0.9)";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("N", SIZE / 2, PAD + 4);

    const quest = worldToMap(state.questX, state.questZ, half);
    ctx.fillStyle = "rgba(201, 123, 154, 0.9)";
    ctx.beginPath();
    ctx.arc(quest.u, quest.v, 5, 0, Math.PI * 2);
    ctx.fill();

    const npc = worldToMap(state.npcX, state.npcZ, half);
    ctx.fillStyle = "rgba(120, 100, 160, 0.95)";
    ctx.fillRect(npc.u - 3, npc.v - 3, 6, 6);

    const player = worldToMap(state.playerX, state.playerZ, half);
    ctx.save();
    ctx.translate(player.u, player.v);
    ctx.rotate(-state.playerRotation + Math.PI);
    ctx.fillStyle = "#e8dff8";
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(6, 7);
    ctx.lineTo(-6, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [state]);

  return (
    <div className="game-minimap" aria-label="미니맵">
      <canvas ref={canvasRef} width={SIZE} height={SIZE} />
    </div>
  );
}
