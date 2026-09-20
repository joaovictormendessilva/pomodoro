import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { Button } from "@/components/Button";
import { routes } from "@/navigation/routes";
import { theme } from "@/theme";
import type { CycleStatus, Step, TimerState } from "@/types/pomodoro";

const timeStateConfig = {
  notStarted: "not-started",
  running: "running",
  paused: "paused",
} as const satisfies Record<string, TimerState>;

const currentStatusConfig = {
  focus: "focus",
  shortBreak: "short-break",
  longBreak: "long-break",
} as const satisfies Record<string, CycleStatus>;

export function HomeScreen() {
  const navigation = useNavigation();
  const initialShortBreakCycleTime = 0.05 * 60;
  const initialLongBreakCycleTime = 0.05 * 60;
  const initialFocusCycleTime = 0.05 * 60;
  const initialCounterCycleTime = 0.05 * 60;

  const [currentStatus, setCurrentStatus] = useState<CycleStatus>(currentStatusConfig.focus);
  const [timerState, setTimerState] = useState<TimerState>(timeStateConfig.notStarted);
  const [step, setStep] = useState<Step>(0);

  const [currentFocusCycleTime] = useState(initialFocusCycleTime);
  const [currentShortBreakCycleTime] = useState(initialShortBreakCycleTime);
  const [currentLongBreakCycleTime] = useState(initialLongBreakCycleTime);

  const [counterCycleTime, setCounterCycleTime] = useState(initialCounterCycleTime);

  const handleStart = () => {
    setTimerState(timeStateConfig.running);
  };

  const handlePause = () => {
    setTimerState(timeStateConfig.paused);
  };

  const handleStop = () => {
    setStep(1);
    setTimerState(timeStateConfig.notStarted);
    setCounterCycleTime(initialCounterCycleTime);
  };

  const cycleTimeProgress = useMemo(() => {
    switch (currentStatus) {
      case currentStatusConfig.focus:
        return 100 - (counterCycleTime / currentFocusCycleTime) * 100;
      case currentStatusConfig.shortBreak:
        return 100 - (counterCycleTime / currentShortBreakCycleTime) * 100;
      case currentStatusConfig.longBreak:
        return 100 - (counterCycleTime / currentLongBreakCycleTime) * 100;

      default:
        return 0;
    }
  }, [currentStatus, counterCycleTime, currentShortBreakCycleTime, currentLongBreakCycleTime]);

  const isNotStarted = timerState === timeStateConfig.notStarted;
  const isRunning = timerState === timeStateConfig.running;
  const isPaused = timerState === timeStateConfig.paused;

  useEffect(() => {
    if (!isRunning) return;

    const ref = setInterval(() => {
      setCounterCycleTime((previous) => (previous <= 0 ? previous : previous - 1));
    }, 1000);

    return () => clearInterval(ref);
  }, [isRunning]);

  useEffect(() => {
    switch (currentStatus) {
      case currentStatusConfig.focus: {
        if (counterCycleTime > 0) break;

        if (step < 4) {
          setStep((previous) => (previous + 1) as Step);
          setCurrentStatus(currentStatusConfig.shortBreak);
          setCounterCycleTime(currentShortBreakCycleTime);
        } else {
          setStep(0);
          setCurrentStatus(currentStatusConfig.longBreak);
          setCounterCycleTime(currentLongBreakCycleTime);
        }
        break;
      }

      case currentStatusConfig.shortBreak:
      case currentStatusConfig.longBreak: {
        if (counterCycleTime <= 0) {
          setCurrentStatus(currentStatusConfig.focus);
          setCounterCycleTime(currentFocusCycleTime);
        }
        break;
      }
    }
  }, [
    step,
    currentStatus,
    counterCycleTime,
    currentFocusCycleTime,
    currentLongBreakCycleTime,
    currentShortBreakCycleTime,
  ]);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => navigation.navigate(routes.Settings)}
      >
        <MaterialIcons name="settings" size={28} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.titleGroup}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Pomodoro</Text>
          </View>

          <View style={styles.stateContainer}>
            {isNotStarted && <Text style={styles.stateText}>Clique em iniciar</Text>}
            {isRunning && currentStatus === currentStatusConfig.focus && (
              <Text style={styles.stateText}>Hora de se concentrar</Text>
            )}
            {isRunning && currentStatus === currentStatusConfig.shortBreak && (
              <Text style={styles.stateText}>Pausa curta</Text>
            )}
            {isRunning && currentStatus === currentStatusConfig.longBreak && (
              <Text style={styles.stateText}>Pausa longa</Text>
            )}
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
  settingsIcon: {
    alignSelf: "flex-end",
    padding: 16,
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
