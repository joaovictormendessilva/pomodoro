import { CycleDurations, goToNextCycle, TimerPosition } from "@/helpers/go-to-next-cycle";

const cycleDurations: CycleDurations = {
  focusPeriod: 1500,
  shortBreak: 300,
  longBreak: 900,
};

describe("goToNextCycle", () => {
  it("goes to the short break after a focus that is not the 4th", () => {
    const finishedCycle: TimerPosition = {
      status: "focus",
      completedPomodoros: 0,
      secondsLeftInCycle: 0,
    };

    const nextCycle: TimerPosition = goToNextCycle(finishedCycle, cycleDurations);

    expect(nextCycle).toEqual({
      status: "short-break",
      completedPomodoros: 1,
      secondsLeftInCycle: 300,
    });
  });

  it("goes to the long break after the 4th focus", () => {
    const finishedCycle: TimerPosition = {
      status: "focus",
      completedPomodoros: 3,
      secondsLeftInCycle: 0,
    };

    const nextCycle: TimerPosition = goToNextCycle(finishedCycle, cycleDurations);

    expect(nextCycle).toEqual({
      status: "long-break",
      completedPomodoros: 4,
      secondsLeftInCycle: 900,
    });
  });

  it("goes back to focus after a short break and keeps the completed pomodoros", () => {
    const finishedCycle: TimerPosition = {
      status: "short-break",
      completedPomodoros: 2,
      secondsLeftInCycle: 0,
    };

    const nextCycle: TimerPosition = goToNextCycle(finishedCycle, cycleDurations);

    expect(nextCycle).toEqual({
      status: "focus",
      completedPomodoros: 2,
      secondsLeftInCycle: 1500,
    });
  });

  it("goes back to focus after the long break and resets the completed pomodoros", () => {
    const finishedCycle: TimerPosition = {
      status: "long-break",
      completedPomodoros: 4,
      secondsLeftInCycle: 0,
    };

    const nextCycle: TimerPosition = goToNextCycle(finishedCycle, cycleDurations);

    expect(nextCycle).toEqual({
      status: "focus",
      completedPomodoros: 0,
      secondsLeftInCycle: 1500,
    });
  });
});
