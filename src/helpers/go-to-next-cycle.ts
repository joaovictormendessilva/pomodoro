import { currentStatusConfig } from "@/constants/app-settings";
import { CycleStatus, Step } from "@/types/pomodoro";

const POMODOROS_UNTIL_LONG_BREAK = 4;

export type TimerPosition = {
  status: CycleStatus;
  completedPomodoros: Step;
  secondsLeftInCycle: number;
};

export type CycleDurations = {
  focusPeriod: number;
  shortBreak: number;
  longBreak: number;
};

export const getCycleDurationInSeconds = (
  status: CycleStatus,
  cycleDurations: CycleDurations,
): number => {
  switch (status) {
    case currentStatusConfig.focus:
      return cycleDurations.focusPeriod;
    case currentStatusConfig.shortBreak:
      return cycleDurations.shortBreak;
    case currentStatusConfig.longBreak:
      return cycleDurations.longBreak;
  }
};

const getStatusAfterFocus = (completedPomodoros: Step): CycleStatus => {
  const isTimeForLongBreak: boolean = completedPomodoros >= POMODOROS_UNTIL_LONG_BREAK;

  if (isTimeForLongBreak) {
    return currentStatusConfig.longBreak;
  }

  return currentStatusConfig.shortBreak;
};

export const goToNextCycle = (
  finishedCycle: TimerPosition,
  cycleDurations: CycleDurations,
): TimerPosition => {
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
    secondsLeftInCycle: getCycleDurationInSeconds(nextStatus, cycleDurations),
  };

  return nextCycle;
};
