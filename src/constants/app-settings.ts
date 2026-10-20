import { CycleStatus, TimerState } from "@/types/pomodoro";

export const timeStateConfig = {
  notStarted: "not-started",
  running: "running",
  paused: "paused",
} as const satisfies Record<string, TimerState>;

export const currentStatusConfig = {
  focus: "focus",
  shortBreak: "short-break",
  longBreak: "long-break",
} as const satisfies Record<string, CycleStatus>;

export const cycleTitleConfig = {
  [currentStatusConfig.focus]: "Hora de se concentrar",
  [currentStatusConfig.shortBreak]: "Pausa curta",
  [currentStatusConfig.longBreak]: "Pausa longa",
} as const satisfies Record<CycleStatus, string>;

