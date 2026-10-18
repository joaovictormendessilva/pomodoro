import { timeStateConfig } from "@/constants/app-settings";
import { goToNextCycle, TimerPosition } from "@/helpers/go-to-next-cycle";
import { AppState } from "@/services/storage/storage.types";

const getSecondsSinceLastSave = (lastSaveDate: number, currentDate: number): number => {
  const millisecondsSinceLastSave: number = currentDate - lastSaveDate;
  const secondsSinceLastSave: number = Math.floor(millisecondsSinceLastSave / 1000);

  return secondsSinceLastSave;
};

const discountSecondsFromTimer = (appState: AppState, secondsToDiscount: number): TimerPosition => {
  let timerPosition: TimerPosition = {
    status: appState.currentStatus,
    completedPomodoros: appState.step,
    secondsLeftInCycle: appState.counterCycleTime,
  };
  let secondsStillToDiscount: number = secondsToDiscount;

  while (secondsStillToDiscount >= timerPosition.secondsLeftInCycle) {
    secondsStillToDiscount = secondsStillToDiscount - timerPosition.secondsLeftInCycle;
    timerPosition = goToNextCycle(timerPosition, appState);
  }

  const finalTimerPosition: TimerPosition = {
    status: timerPosition.status,
    completedPomodoros: timerPosition.completedPomodoros,
    secondsLeftInCycle: timerPosition.secondsLeftInCycle - secondsStillToDiscount,
  };

  return finalTimerPosition;
};

export const updateStateByElapsedTime = (appState: AppState): AppState => {
  const isTimerRunning: boolean = appState.timerState === timeStateConfig.running;
  if (!isTimerRunning) return appState;

  const currentDate: number = Date.now();
  const lastSaveDate: number = appState.dateNow ?? currentDate;
  const secondsSinceLastSave: number = getSecondsSinceLastSave(lastSaveDate, currentDate);
  if (secondsSinceLastSave <= 0) return appState;

  const timerPosition: TimerPosition = discountSecondsFromTimer(appState, secondsSinceLastSave);

  const updatedAppState: AppState = {
    step: timerPosition.completedPomodoros,
    currentStatus: timerPosition.status,
    counterCycleTime: timerPosition.secondsLeftInCycle,
    focusPeriod: appState.focusPeriod,
    shortBreak: appState.shortBreak,
    longBreak: appState.longBreak,
    timerState: appState.timerState,
    dateNow: currentDate,
  };

  return updatedAppState;
};
