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
