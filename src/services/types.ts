import { CycleStatus, Step, TimerState } from "@/types/pomodoro";

export type PomodoroSettings = {
  focusPeriod: number;
  shortBreak: number;
  longBreak: number;
  notificationPeriod: boolean;
};

export type AppState = {
  step: Step;
  currentStatus: CycleStatus;
  counterCycleTime: number;
  focusPeriod: number;
  longBreak: number;
  shortBreak: number;
  timerState: TimerState;
};
