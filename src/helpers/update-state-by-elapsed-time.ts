import { currentStatusConfig, timeStateConfig } from "@/constants/app-settings";
import { AppState } from "@/services/types";
import { CycleStatus, Step } from "@/types/pomodoro";

export const updateStateByElapsedTime = (appState: AppState): AppState => {
  if (appState.timerState !== timeStateConfig.running) return appState;

  const now: number = Date.now();
  const elapsedSeconds: number = Math.floor((now - (appState.dateNow ?? now)) / 1000);
  if (elapsedSeconds <= 0) return appState;

  let remaining: number = appState.counterCycleTime;
  let timeLeft: number = remaining - elapsedSeconds;
  let currentStatus: CycleStatus = appState.currentStatus;
  let step: Step = appState.step;

  const advanceCycle = () => {
    if (currentStatus === currentStatusConfig.focus) {
      step = (step + 1) as Step;

      if (step < 4) {
        currentStatus = currentStatusConfig.shortBreak;
        return appState.shortBreak;
      }

      currentStatus = currentStatusConfig.longBreak;
      return appState.longBreak;
    }

    if (currentStatus === currentStatusConfig.shortBreak) {
      currentStatus = currentStatusConfig.focus;
      return appState.focusPeriod;
    }

    if (currentStatus === currentStatusConfig.longBreak) {
      step = 0;
      currentStatus = currentStatusConfig.focus;
      return appState.focusPeriod;
    }

    return remaining;
  };

  while (timeLeft <= 0) {
    const overflow: number = Math.abs(timeLeft);
    const nextTime: number = advanceCycle();

    timeLeft = nextTime - overflow;
  }

  return {
    ...appState,
    step,
    dateNow: now,
    currentStatus,
    counterCycleTime: timeLeft,
  };
};
