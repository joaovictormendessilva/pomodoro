import { currentStatusConfig, timeStateConfig } from "@/constants/app-settings";
import { AppState } from "@/services/types";
import { CycleStatus, Step } from "@/types/pomodoro";

const POMODOROS_UNTIL_LONG_BREAK = 4;

type TimerPosition = {
  status: CycleStatus;
  completedPomodoros: Step;
  secondsLeftInCycle: number;
};

const getSecondsSinceLastSave = (lastSaveDate: number, currentDate: number): number => {
  const millisecondsSinceLastSave: number = currentDate - lastSaveDate;
  const secondsSinceLastSave: number = Math.floor(millisecondsSinceLastSave / 1000);

  return secondsSinceLastSave;
};

const getCycleDurationInSeconds = (status: CycleStatus, appState: AppState): number => {
  switch (status) {
    case currentStatusConfig.focus:
      return appState.focusPeriod;
    case currentStatusConfig.shortBreak:
      return appState.shortBreak;
    case currentStatusConfig.longBreak:
      return appState.longBreak;
  }
};

const getStatusAfterFocus = (completedPomodoros: Step): CycleStatus => {
  const isTimeForLongBreak: boolean = completedPomodoros >= POMODOROS_UNTIL_LONG_BREAK;

  if (isTimeForLongBreak) {
    return currentStatusConfig.longBreak;
  }

  return currentStatusConfig.shortBreak;
};

const goToNextCycle = (finishedCycle: TimerPosition, appState: AppState): TimerPosition => {
  const finishedFocus: boolean = finishedCycle.status === currentStatusConfig.focus;
  const finishedLongBreak: boolean = finishedCycle.status === currentStatusConfig.longBreak;

  let nextStatus: CycleStatus = currentStatusConfig.focus;
  let completedPomodoros: Step = finishedCycle.completedPomodoros;

  if (finishedFocus) {
    completedPomodoros = (completedPomodoros + 1) as Step;
    nextStatus = getStatusAfterFocus(completedPomodoros);
  }

  if (finishedLongBreak) {
    completedPomodoros = 0;
  }

  const nextCycle: TimerPosition = {
    status: nextStatus,
    completedPomodoros: completedPomodoros,
    secondsLeftInCycle: getCycleDurationInSeconds(nextStatus, appState),
  };

  return nextCycle;
};

const discountSecondsFromTimer = (
  appState: AppState,
  secondsToDiscount: number,
): TimerPosition => {
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
