import { CycleDurations, goToNextCycle, TimerPosition } from "@/helpers/go-to-next-cycle";
import { AppState } from "@/services/storage/storage.types";
import { CycleStatus, Step } from "@/types/pomodoro";

const MILLISECONDS_IN_ONE_SECOND = 1000;
const CURRENT_CYCLE_NUMBER = 0;

export type CycleWithDates = {
  cycleNumber: number;
  status: CycleStatus;
  completedPomodoros: Step;
  startDate: number;
  endDate: number;
};

const convertSecondsToMilliseconds = (seconds: number): number => {
  return seconds * MILLISECONDS_IN_ONE_SECOND;
};

export const getCurrentCycle = (appState: AppState, currentDate: number): CycleWithDates => {
  const millisecondsLeftInCycle: number = convertSecondsToMilliseconds(appState.counterCycleTime);

  const currentCycle: CycleWithDates = {
    cycleNumber: CURRENT_CYCLE_NUMBER,
    status: appState.currentStatus,
    completedPomodoros: appState.step,
    startDate: currentDate,
    endDate: currentDate + millisecondsLeftInCycle,
  };

  return currentCycle;
};

const getCycleAfter = (
  previousCycle: CycleWithDates,
  cycleDurations: CycleDurations,
): CycleWithDates => {
  const finishedCycle: TimerPosition = {
    status: previousCycle.status,
    completedPomodoros: previousCycle.completedPomodoros,
    secondsLeftInCycle: 0,
  };
  const nextCycle: TimerPosition = goToNextCycle(finishedCycle, cycleDurations);
  const nextCycleDurationInMilliseconds: number = convertSecondsToMilliseconds(
    nextCycle.secondsLeftInCycle,
  );

  const cycleAfter: CycleWithDates = {
    cycleNumber: previousCycle.cycleNumber + 1,
    status: nextCycle.status,
    completedPomodoros: nextCycle.completedPomodoros,
    startDate: previousCycle.endDate,
    endDate: previousCycle.endDate + nextCycleDurationInMilliseconds,
  };

  return cycleAfter;
};

export const getNextCycles = (
  currentCycle: CycleWithDates,
  cycleDurations: CycleDurations,
  numberOfNextCycles: number,
): CycleWithDates[] => {
  const nextCycles: CycleWithDates[] = [];
  let previousCycle: CycleWithDates = currentCycle;

  while (nextCycles.length < numberOfNextCycles) {
    const cycleAfter: CycleWithDates = getCycleAfter(previousCycle, cycleDurations);

    nextCycles.push(cycleAfter);
    previousCycle = cycleAfter;
  }

  return nextCycles;
};
