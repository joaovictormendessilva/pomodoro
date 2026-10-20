import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { currentStatusConfig, cycleTitleConfig, timeStateConfig } from "@/constants/app-settings";
import { CycleDurations, goToNextCycle, TimerPosition } from "@/helpers/go-to-next-cycle";
import { routes } from "@/navigation/routes";
import { saveAppState } from "@/services/storage/storage.service";
import { AppState, PomodoroSettings } from "@/services/storage/storage.types";
import { theme } from "@/theme";
import type { CycleStatus, Step, TimerState } from "@/types/pomodoro";

type PomodoroTimerProps = {
  settings: PomodoroSettings;
  appState: AppState | null;
};

export function PomodoroTimer({ settings, appState }: PomodoroTimerProps) {
  const navigation = useNavigation();

  const focusPeriod = settings.focusPeriod * 60;
  const shortBreak = settings.shortBreak * 60;
  const longBreak = settings.longBreak * 60;

  const [currentStatus, setCurrentStatus] = useState<CycleStatus>(
    appState?.currentStatus ? appState.currentStatus : currentStatusConfig.focus,
  );
  const [timerState, setTimerState] = useState<TimerState>(
    appState?.timerState ? appState.timerState : timeStateConfig.notStarted,
  );
  const [step, setStep] = useState<Step>(appState?.step ? appState.step : 0);

  const [counterCycleTime, setCounterCycleTime] = useState(
    appState?.counterCycleTime ?? focusPeriod,
  );

  const handleStart = () => {
    setTimerState(timeStateConfig.running);
  };

  const handlePause = () => {
    setTimerState(timeStateConfig.paused);
  };

  const handleStop = async () => {
    setStep(0);
    setCurrentStatus(currentStatusConfig.focus);
    setTimerState(timeStateConfig.notStarted);
    setCounterCycleTime(focusPeriod);
  };

  const cycleTimeProgress = useMemo(() => {
    switch (currentStatus) {
      case currentStatusConfig.focus:
        return 100 - (counterCycleTime / focusPeriod) * 100;
      case currentStatusConfig.shortBreak:
        return 100 - (counterCycleTime / shortBreak) * 100;
      case currentStatusConfig.longBreak:
        return 100 - (counterCycleTime / longBreak) * 100;

      default:
        return 0;
    }
  }, [currentStatus, focusPeriod, counterCycleTime, shortBreak, longBreak]);

  const isNotStarted = timerState === timeStateConfig.notStarted;
  const isRunning = timerState === timeStateConfig.running;
  const isPaused = timerState === timeStateConfig.paused;

  useEffect(() => {
    if (timerState === timeStateConfig.notStarted) {
      setCounterCycleTime(focusPeriod);
    }
  }, [focusPeriod, timerState]);

  useEffect(() => {
    if (!isRunning) return;

    const ref = setInterval(() => {
      setCounterCycleTime((previous) => (previous <= 0 ? previous : previous - 1));
    }, 1000);

    return () => clearInterval(ref);
  }, [isRunning]);

  useEffect(() => {
    const isCycleFinished: boolean = counterCycleTime <= 0;

    if (isCycleFinished) {
      const finishedCycle: TimerPosition = {
        status: currentStatus,
        completedPomodoros: step,
        secondsLeftInCycle: counterCycleTime,
      };
      const cycleDurations: CycleDurations = { focusPeriod, shortBreak, longBreak };
      const nextCycle: TimerPosition = goToNextCycle(finishedCycle, cycleDurations);

      setCurrentStatus(nextCycle.status);
      setStep(nextCycle.completedPomodoros);
      setCounterCycleTime(nextCycle.secondsLeftInCycle);
    }

    saveAppState({
      step,
      currentStatus,
      counterCycleTime,
      focusPeriod,
      longBreak,
      shortBreak,
      timerState,
      dateNow: Date.now(),
    });
  }, [step, currentStatus, counterCycleTime, focusPeriod, longBreak, shortBreak, timerState]);

  return (
    <View style={styles.mainContainer}>
      <IconButton
        icon="settings"
        accessibilityLabel="Abrir configurações"
        onPress={() => navigation.navigate(routes.Settings)}
        disabled={timerState !== timeStateConfig.notStarted}
        style={{
          ...styles.settingsButton,
          opacity: timerState !== timeStateConfig.notStarted ? 0 : 1,
        }}
      />

      <View style={styles.container}>
        <View style={styles.titleGroup}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Pomodoro</Text>
          </View>

          <View style={styles.stateContainer}>
            {isNotStarted && <Text style={styles.stateText}>Clique em iniciar</Text>}
            {isRunning && <Text style={styles.stateText}>{cycleTitleConfig[currentStatus]}</Text>}
            {isPaused && <Text style={styles.stateText}>Cronômetro em pausa</Text>}
          </View>

          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={160}
              width={7}
              tintColor={theme.colors.primary}
              rotation={0}
              backgroundColor={theme.colors.divider}
              fill={cycleTimeProgress}
              children={() => (
                <Text style={styles.progressText}>
                  {Math.floor(counterCycleTime / 60)}:
                  {(counterCycleTime % 60).toString().padStart(2, "0")}
                </Text>
              )}
            />
          </View>

          {isNotStarted && (
            <View style={styles.buttonContainer}>
              <Button text="Iniciar" onPress={handleStart} />
            </View>
          )}

          {isRunning && (
            <View style={styles.buttonContainer}>
              <Button text="Pausar" onPress={handlePause} />
              <Button text="Parar" variant="outlined" onPress={handleStop} />
            </View>
          )}

          {isPaused && (
            <View style={styles.buttonContainer}>
              <Button text="Continuar" onPress={handleStart} />
              <Button text="Parar" variant="outlined" onPress={handleStop} />
            </View>
          )}

          <View style={styles.pomodorosContainer}>
            <Text style={styles.pomodoroText}>Pomodoros:</Text>

            <View style={step >= 1 ? styles.pomodoroDotCompleted : styles.pomodoroDot} />
            <View style={step >= 2 ? styles.pomodoroDotCompleted : styles.pomodoroDot} />
            <View style={step >= 3 ? styles.pomodoroDotCompleted : styles.pomodoroDot} />
            <View style={step >= 4 ? styles.pomodoroDotCompleted : styles.pomodoroDot} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  settingsButton: {
    alignSelf: "flex-end",
  },
  container: {
    gap: 36,
    justifyContent: "center",
    flex: 1,
  },
  titleGroup: {
    gap: 24,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.title,
    fontFamily: theme.fonts.interBold,
  },

  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.title,
    fontFamily: theme.fonts.interBold,
  },

  stateContainer: {
    alignItems: "center",
  },
  stateText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.interRegular,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },

  pomodorosContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  pomodoroText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.interRegular,
    fontSize: theme.fontSizes.body,
  },

  pomodoroDot: {
    height: 20,
    width: 20,
    backgroundColor: theme.colors.divider,
    borderRadius: 25,
  },

  pomodoroDotCompleted: {
    height: 20,
    width: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
  },
});
