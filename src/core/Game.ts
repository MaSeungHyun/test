import * as THREE from "three";
import playerModel from "@/assets/player.glb";
import {
  CAMERA_FOCUS_HEIGHT,
  CAMERA_FOV,
  FLOOR_SIZE,
  MONOLOGUE_DISPLAY_MS,
  SAVE_INTERVAL_SEC,
} from "@/core/constants";
import {
  createGameOrbitControls,
  type GameOrbitControls,
} from "@/core/camera/controls";
import { OrbitCameraFollow } from "@/core/camera/follow";
import { setupInitialCamera } from "@/core/camera/setup";
import { Character } from "@/core/entities/Character";
import { Interactable } from "@/core/entities/Interactable";
import { Npc } from "@/core/entities/Npc";
import { createFloor, type FloorHandle } from "@/core/entities/Floor";
import { createFog, type FogHandle } from "@/core/environment/Fog";
import {
  createLighting,
  type LightingHandle,
} from "@/core/environment/Lighting";
import { createRain, type RainHandle } from "@/core/environment/Rain";
import { createMemoryMarkers, type MemoryMarkersHandle } from "@/core/environment/memoryMarkers";
import { createScatterProps, type ScatterPropsHandle } from "@/core/environment/scatterProps";
import { MemorySystem } from "@/core/systems/MemorySystem";
import { Bgm } from "@/core/audio/Bgm";
import { Sfx } from "@/core/audio/Sfx";
import { KeyboardInput } from "@/core/input/KeyboardInput";
import { resizeViewport } from "@/core/viewport/resize";
import type { GameUiBridge } from "@/core/ui/bridge";
import { DialogueSystem } from "@/core/systems/DialogueSystem";
import { EndingSystem } from "@/core/systems/EndingSystem";
import { InteractionSystem } from "@/core/systems/InteractionSystem";
import { MonologueSystem } from "@/core/systems/MonologueSystem";
import { QuestSystem } from "@/core/systems/QuestSystem";
import { SaveSystem } from "@/core/systems/SaveSystem";
import { StressSystem } from "@/core/systems/StressSystem";

export class Game {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: GameOrbitControls;
  private cameraFollow = new OrbitCameraFollow();
  private container: HTMLDivElement;
  private ui: GameUiBridge;
  private character: Character;
  private keyboard: KeyboardInput;
  private floor: FloorHandle | null = null;
  private lighting: LightingHandle | null = null;
  private fog: FogHandle | null = null;
  private rain: RainHandle | null = null;
  private props: ScatterPropsHandle | null = null;
  private memoryMarkers: MemoryMarkersHandle | null = null;
  private npcs: Npc[] = [];
  private interactables: Interactable[] = [];
  private memories = new MemorySystem();
  private journalRecent: string | null = null;
  private journalRecentTimer = 0;
  private animationId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private onWindowResize = () => this.resize();
  private clock = new THREE.Clock();
  private bgm: Bgm;
  private sfx = new Sfx();
  private stress = new StressSystem();
  private quest = new QuestSystem();
  private monologue = new MonologueSystem();
  private dialogue = new DialogueSystem();
  private interaction = new InteractionSystem();
  private ending = new EndingSystem();
  private save = new SaveSystem();
  private saveTimer = 0;
  private sceneReady = false;

  private tryPlayBgm = () => {
    this.bgm.play();
    this.sfx.resume();
  };

  private constructor(container: HTMLDivElement, ui: GameUiBridge) {
    this.container = container;
    this.ui = ui;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030208);

    this.character = new Character();
    this.scene.add(this.character.root);

    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      container.clientWidth / container.clientHeight || 1,
      0.1,
      400,
    );
    this.camera.position.set(0, 6, 10);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.3;
    const canvas = this.renderer.domElement;
    canvas.style.display = "block";
    container.appendChild(canvas);

    this.controls = createGameOrbitControls(this.camera, canvas);
    this.keyboard = new KeyboardInput();
    this.bgm = new Bgm();

    container.addEventListener("pointerdown", this.tryPlayBgm);
    container.addEventListener("keydown", this.tryPlayBgm);

    ui.onTimeLabel("새벽 3:17");
    ui.onQuestUpdate(this.quest.toUi());
    ui.onStressChange(Math.round(this.stress.value));
  }

  static async create(
    container: HTMLDivElement,
    ui: GameUiBridge,
  ): Promise<Game> {
    const game = new Game(container, ui);

    game.resizeObserver = new ResizeObserver(() => game.resize());
    game.resizeObserver.observe(container);
    window.addEventListener("resize", game.onWindowResize);
    game.resize();

    try {
      await game.setupScene();
      game.sceneReady = true;
      game.start();
      game.resize();
    } catch (error) {
      console.error("씬 로드 실패:", error);
    }

    return game;
  }

  private async setupScene() {
    this.fog = createFog(this.scene);
    this.lighting = createLighting(this.scene);
    this.floor = createFloor(this.scene, FLOOR_SIZE);
    this.rain = createRain(this.scene);
    this.props = createScatterProps(this.scene);

    this.memoryMarkers = createMemoryMarkers(this.scene);

    this.npcs = [
      new Npc(this.scene, 2, -8),
      new Npc(this.scene, -10, 22, {
        talkLabel: "말 걸기 [E]",
        dialogueId: "npc2_intro",
        bodyColor: 0x4a5a6a,
        emissive: 0x1a2a3a,
      }),
    ];

    this.interactables = [
      new Interactable("bench", -14, 10, this.scene),
      new Interactable("phone", 22, -16, this.scene),
      new Interactable("cigarette", -26, -12, this.scene),
      new Interactable("vending", 18, 4, this.scene),
      new Interactable("mirror", -8, -22, this.scene),
      new Interactable("letter", 14, 20, this.scene),
      new Interactable("fountain", 24, 14, this.scene),
      new Interactable("shrine", -32, 6, this.scene),
    ];

    await this.character.load(playerModel);

    const saved = this.save.load();
    if (saved?.x !== undefined && saved.z !== undefined) {
      this.character.setPosition(saved.x, saved.z);
      this.stress.value = saved.stress ?? this.stress.value;
      this.quest.load({
        stage: saved.questStage,
        completed: saved.questCompleted,
      });
      if (!this.quest.allCompleted) {
        const q = this.quest.current;
        this.props?.setQuestTarget(q.targetX, q.targetZ);
      }
      this.dialogue.load({ talkedToNpc: saved.talkedToNpc });
      this.memories.load(saved.memories);
      this.memoryMarkers.update(this.memories);
    }

    setupInitialCamera(
      this.camera,
      this.controls,
      this.character.root,
      CAMERA_FOCUS_HEIGHT,
    );
    this.cameraFollow.sync(
      this.character.root,
      this.camera,
      this.controls,
      CAMERA_FOCUS_HEIGHT,
    );
    this.controls.update();

    this.ui.onStressChange(Math.round(this.stress.value));
    this.ui.onQuestUpdate(this.quest.toUi());
    this.pushUi();
  }

  private pushUi() {
    const q = this.quest.current;
    const mainNpc = this.npcs[0];
    this.ui.onMinimapUpdate({
      playerX: this.character.root.position.x,
      playerZ: this.character.root.position.z,
      playerRotation: this.character.root.rotation.y,
      questX: q.targetX,
      questZ: q.targetZ,
      npcX: mainNpc?.root.position.x ?? 0,
      npcZ: mainNpc?.root.position.z ?? 0,
    });
    this.ui.onJournalUpdate({
      found: this.memories.count,
      total: this.memories.total,
      recentTitle: this.journalRecent,
    });
  }

  handleDialogueChoice(id: string) {
    this.dialogue.choose(id, this.ui);
  }

  handleDialogueAdvance() {
    this.dialogue.advance(this.ui);
  }

  restart() {
    localStorage.removeItem("menhera-save");
    location.reload();
  }

  private resize() {
    const size = resizeViewport(this.container, this.camera, this.renderer);
    if (size.width <= 1 || size.height <= 1) return;
    this.draw();
  }

  /** 화면 크기만 바꿀 때 — physics/logic 없이 그리기 */
  private draw() {
    if (!this.sceneReady) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    this.cameraFollow.update(
      this.character.root,
      this.camera,
      this.controls,
      CAMERA_FOCUS_HEIGHT,
    );
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private handleInteract() {
    if (this.npcs.length === 0) return;
    const pos = this.character.root.position;
    const nearby = this.interaction.findNearby(
      pos,
      this.npcs,
      this.interactables,
    );
    if (!nearby) return;

    if (nearby.kind === "npc") {
      this.dialogue.start(nearby.npc.dialogueId, this.ui);
      return;
    }

    const obj = nearby.object;
    this.dialogue.start(obj.dialogueId, this.ui);
    if (obj.restSeconds > 0) {
      this.interaction.startRest(obj.restSeconds);
      this.character.movementEnabled = false;
    }
    if (obj.dialogueId === "cigarette") {
      this.stress.value = Math.min(100, this.stress.value + 3);
    }
    if (obj.dialogueId === "vending") {
      this.stress.value = Math.max(0, this.stress.value - 6);
    }
    if (obj.dialogueId === "shrine" || obj.dialogueId === "bench") {
      this.stress.value = Math.max(0, this.stress.value - 10);
    }
  }

  private render() {
    if (!this.sceneReady) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const delta = this.clock.getDelta();
    const blocked =
      this.dialogue.active || this.ending.triggered || this.interaction.resting;

    this.interaction.updateRest(delta);
    this.character.movementEnabled =
      !this.dialogue.active &&
      !this.ending.triggered &&
      !this.interaction.resting;

    const isMoving = this.keyboard.isMoving && this.character.movementEnabled;
    const isRunning = this.keyboard.isRunning && isMoving;

    if (!blocked && !this.ending.triggered) {
      this.character.updateMovement(
        this.keyboard.pressedKeys,
        this.camera,
        delta,
        isRunning,
      );
    }

    this.character.updateAnimation(delta, isMoving, isRunning);

    const pos = this.character.root.position;
    if (this.quest.update(pos.x, pos.z) && !this.quest.allCompleted) {
      const q = this.quest.current;
      this.props?.setQuestTarget(q.targetX, q.targetZ);
    }
    this.stress.update(
      delta,
      isMoving,
      isRunning,
      this.interaction.resting,
    );

    this.monologue.update(
      delta,
      isMoving,
      (line) => {
        this.ui.onMonologue(line);
        setTimeout(() => this.ui.onMonologue(null), MONOLOGUE_DISPLAY_MS);
      },
      blocked,
    );

    this.memories.update(
      pos.x,
      pos.z,
      (spot) => {
        this.journalRecent = spot.title;
        this.journalRecentTimer = 5;
        this.ui.onMonologue(spot.text);
        setTimeout(() => this.ui.onMonologue(null), MONOLOGUE_DISPLAY_MS + 500);
        this.memoryMarkers?.update(this.memories);
      },
      blocked,
    );

    if (this.journalRecentTimer > 0) {
      this.journalRecentTimer -= delta;
      if (this.journalRecentTimer <= 0) this.journalRecent = null;
    }

    if (!blocked && this.keyboard.consumeInteract()) {
      this.handleInteract();
    }

    const nearby =
      this.npcs.length > 0
        ? this.interaction.findNearby(pos, this.npcs, this.interactables)
        : null;
    if (!blocked && nearby) {
      const label =
        nearby.kind === "npc" ? nearby.label : nearby.object.label;
      this.ui.onInteractPrompt(true, label);
    } else {
      this.ui.onInteractPrompt(false);
    }

    const ending = this.ending.check(
      this.quest.allCompleted,
      this.stress.value,
      this.dialogue.hasTalkedToNpc,
      this.memories.count,
      this.memories.total,
    );
    if (ending) {
      this.ui.onEnding(ending);
      this.character.movementEnabled = false;
    }

    this.rain?.update(delta);
    if (this.props) {
      this.props.questMarker.rotation.z += delta * 0.5;
    }
    this.sfx.update(delta, isMoving, isRunning);

    this.cameraFollow.update(
      this.character.root,
      this.camera,
      this.controls,
      CAMERA_FOCUS_HEIGHT,
    );
    this.controls.update();
    this.lighting?.setAccentPosition(pos);
    this.pushUi();

    const stressNorm = this.stress.normalized;
    this.renderer.toneMappingExposure = 0.28 - stressNorm * 0.08;
    this.ui.onStressChange(Math.round(this.stress.value));
    this.ui.onQuestUpdate(this.quest.toUi());
    this.ui.onGlitch(this.stress.isHigh);

    this.saveTimer += delta;
    if (this.saveTimer >= SAVE_INTERVAL_SEC) {
      this.saveTimer = 0;
      this.save.save({
        x: pos.x,
        z: pos.z,
        stress: this.stress.value,
        questStage: this.quest.stage,
        questCompleted: this.quest.allCompleted,
        talkedToNpc: this.dialogue.hasTalkedToNpc,
        memories: this.memories.serialize(),
        flags: [],
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  private start() {
    const loop = () => {
      this.animationId = requestAnimationFrame(loop);
      this.render();
    };
    loop();
  }

  dispose() {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);

    this.container.removeEventListener("pointerdown", this.tryPlayBgm);
    this.container.removeEventListener("keydown", this.tryPlayBgm);
    this.bgm.dispose();
    this.sfx.dispose();
    this.keyboard.dispose();
    this.floor?.dispose();
    this.fog?.dispose();
    this.rain?.dispose();
    this.props?.dispose();
    this.memoryMarkers?.dispose();
    this.lighting?.dispose();
    for (const npc of this.npcs) npc.dispose(this.scene);
    for (const obj of this.interactables) obj.dispose(this.scene);
    window.removeEventListener("resize", this.onWindowResize);
    this.resizeObserver?.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
