import { CycleWithDates, getCurrentCycle, getNextCycles } from "@/helpers/get-cycles-with-dates";
import { AppState } from "@/services/storage/storage.types";
import { CycleStatus, Step } from "@/types/pomodoro";

const CURRENT_DATE = 1_000_000;
const FOCUS_PERIOD = 1500;
const SHORT_BREAK = 300;
const LONG_BREAK = 900;

type AppStateFields = {
  step?: Step;
  currentStatus?: CycleStatus;
  counterCycleTime?: number;
};

const createAppState = (fields: AppStateFields): AppState => {
  const appState: AppState = {
    step: fields.step ?? 0,
    currentStatus: fields.currentStatus ?? "focus",
    counterCycleTime: fields.counterCycleTime ?? FOCUS_PERIOD,
    timerState: "running",
    focusPeriod: FOCUS_PERIOD,
    shortBreak: SHORT_BREAK,
    longBreak: LONG_BREAK,
    dateNow: CURRENT_DATE,
  };

  return appState;
};

const secondsFromNow = (seconds: number): number => {
  return CURRENT_DATE + seconds * 1000;
};

describe("getCurrentCycle", () => {
  it("starts now and ends when the seconds left are over", () => {
    const appState: AppState = createAppState({ counterCycleTime: 600 });

    const currentCycle: CycleWithDates = getCurrentCycle(appState, CURRENT_DATE);

    expect(currentCycle.cycleNumber).toBe(0);
    expect(currentCycle.status).toBe("focus");
    expect(currentCycle.startDate).toBe(CURRENT_DATE);
    expect(currentCycle.endDate).toBe(secondsFromNow(600));
  });
});

describe("getNextCycles", () => {
  it("returns the amount of cycles that was asked", () => {
    const appState: AppState = createAppState({});
    const currentCycle: CycleWithDates = getCurrentCycle(appState, CURRENT_DATE);

    const nextCycles: CycleWithDates[] = getNextCycles(currentCycle, appState, 8);

    expect(nextCycles).toHaveLength(8);
  });

  it("starts each cycle when the previous one ends", () => {
    const appState: AppState = createAppState({ counterCycleTime: 600 });
    const currentCycle: CycleWithDates = getCurrentCycle(appState, CURRENT_DATE);

    const nextCycles: CycleWithDates[] = getNextCycles(currentCycle, appState, 2);

    expect(nextCycles[0].status).toBe("short-break");
    expect(nextCycles[0].startDate).toBe(secondsFromNow(600));
    expect(nextCycles[0].endDate).toBe(secondsFromNow(600 + SHORT_BREAK));
    expect(nextCycles[1].status).toBe("focus");
    expect(nextCycles[1].startDate).toBe(secondsFromNow(600 + SHORT_BREAK));
    expect(nextCycles[1].endDate).toBe(secondsFromNow(600 + SHORT_BREAK + FOCUS_PERIOD));
  });

  it("starts the long break after the fourth focus", () => {
    const appState: AppState = createAppState({ step: 3 });
    const currentCycle: CycleWithDates = getCurrentCycle(appState, CURRENT_DATE);

    const nextCycles: CycleWithDates[] = getNextCycles(currentCycle, appState, 1);

    expect(nextCycles[0].status).toBe("long-break");
    expect(nextCycles[0].completedPomodoros).toBe(4);
  });

  it("numbers the cycles in order after the current one", () => {
    const appState: AppState = createAppState({});
    const currentCycle: CycleWithDates = getCurrentCycle(appState, CURRENT_DATE);

    const nextCycles: CycleWithDates[] = getNextCycles(currentCycle, appState, 3);
    const cycleNumbers: number[] = nextCycles.map((cycle) => cycle.cycleNumber);

    expect(cycleNumbers).toEqual([1, 2, 3]);
  });
});
