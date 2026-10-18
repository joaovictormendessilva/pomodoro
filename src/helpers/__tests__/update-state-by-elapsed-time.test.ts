import { updateStateByElapsedTime } from "@/helpers/update-state-by-elapsed-time";
import { AppState } from "@/services/storage/storage.types";
import { CycleStatus, Step, TimerState } from "@/types/pomodoro";

const LAST_SAVE_DATE = 1_000_000;

type AppStateFields = {
  step?: Step;
  currentStatus?: CycleStatus;
  counterCycleTime?: number;
  timerState?: TimerState;
};

const createAppState = (fields: AppStateFields): AppState => {
  const appState: AppState = {
    step: fields.step ?? 0,
    currentStatus: fields.currentStatus ?? "focus",
    counterCycleTime: fields.counterCycleTime ?? 1500,
    timerState: fields.timerState ?? "running",
    focusPeriod: 1500,
    shortBreak: 300,
    longBreak: 900,
    dateNow: LAST_SAVE_DATE,
  };

  return appState;
};

const pretendSecondsHavePassed = (seconds: number): number => {
  const currentDate: number = LAST_SAVE_DATE + seconds * 1000;
  jest.spyOn(Date, "now").mockReturnValue(currentDate);

  return currentDate;
};

describe("updateStateByElapsedTime", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not change anything when the timer is paused", () => {
    const appState: AppState = createAppState({ timerState: "paused" });
    pretendSecondsHavePassed(600);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState).toBe(appState);
  });

  it("does not change anything when the timer was never started", () => {
    const appState: AppState = createAppState({ timerState: "not-started" });
    pretendSecondsHavePassed(600);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState).toBe(appState);
  });

  it("does not change anything when no time has passed", () => {
    const appState: AppState = createAppState({});
    pretendSecondsHavePassed(0);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState).toBe(appState);
  });

  it("only decreases the timer when the current cycle has not finished", () => {
    const appState: AppState = createAppState({ counterCycleTime: 1500 });
    pretendSecondsHavePassed(600);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState.currentStatus).toBe("focus");
    expect(updatedAppState.step).toBe(0);
    expect(updatedAppState.counterCycleTime).toBe(900);
  });

  it("saves the current date as the new save date", () => {
    const appState: AppState = createAppState({});
    const currentDate: number = pretendSecondsHavePassed(600);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState.dateNow).toBe(currentDate);
  });

  it("goes to the short break when the focus finishes", () => {
    const appState: AppState = createAppState({ counterCycleTime: 1500 });
    pretendSecondsHavePassed(1500);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState.currentStatus).toBe("short-break");
    expect(updatedAppState.step).toBe(1);
    expect(updatedAppState.counterCycleTime).toBe(300);
  });

  it("goes to the long break when the 4th focus finishes", () => {
    const appState: AppState = createAppState({ step: 3, counterCycleTime: 100 });
    pretendSecondsHavePassed(100);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState.currentStatus).toBe("long-break");
    expect(updatedAppState.step).toBe(4);
    expect(updatedAppState.counterCycleTime).toBe(900);
  });

  it("resets the completed pomodoros when the long break finishes", () => {
    const appState: AppState = createAppState({
      step: 4,
      currentStatus: "long-break",
      counterCycleTime: 100,
    });
    pretendSecondsHavePassed(100);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState.currentStatus).toBe("focus");
    expect(updatedAppState.step).toBe(0);
    expect(updatedAppState.counterCycleTime).toBe(1500);
  });

  it("skips more than one cycle when a lot of time has passed", () => {
    const appState: AppState = createAppState({ counterCycleTime: 1500 });
    const focusSeconds: number = 1500;
    const shortBreakSeconds: number = 300;
    pretendSecondsHavePassed(focusSeconds + shortBreakSeconds + 100);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState.currentStatus).toBe("focus");
    expect(updatedAppState.step).toBe(1);
    expect(updatedAppState.counterCycleTime).toBe(1400);
  });

  it("goes through a whole round of 4 pomodoros and starts again", () => {
    const appState: AppState = createAppState({ counterCycleTime: 1500 });
    const fourFocusSeconds: number = 4 * 1500;
    const threeShortBreaksSeconds: number = 3 * 300;
    const longBreakSeconds: number = 900;
    pretendSecondsHavePassed(fourFocusSeconds + threeShortBreaksSeconds + longBreakSeconds + 60);

    const updatedAppState: AppState = updateStateByElapsedTime(appState);

    expect(updatedAppState.currentStatus).toBe("focus");
    expect(updatedAppState.step).toBe(0);
    expect(updatedAppState.counterCycleTime).toBe(1440);
  });
});
