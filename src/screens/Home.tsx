import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { Button } from "@/components/Button";
import { routes } from "@/navigation/routes";
import { theme } from "@/theme";

type TimeStateProps = "paused" | "running" | "not-started";
type CurrentFocusStatusProps = "focus" | "short-break" | "long-break";
type StepsProps = 0 | 1 | 2 | 3 | 4;

const timeStateConfig = {
  notStarted: "not-started",
  running: "running",
  paused: "paused",
} as const satisfies Record<string, TimeStateProps>;

const currentStatusConfig = {
  focus: "focus",
  shortBreak: "short-break",
  longBreak: "long-break",
} as const satisfies Record<string, CurrentFocusStatusProps>;

export function HomeScreen() {
  const navigation = useNavigation();
  const initialShortBeakCicleTime = 0.05 * 60;
  const initialLongBeakCicleTime = 0.05 * 60;
  const initialFocusCicleTime = 0.05 * 60;
  const initialCounterCicleTime = 0.05 * 60;

  const [currentStatus, setCurrentStatus] = useState<CurrentFocusStatusProps>(
    currentStatusConfig.focus,
  );
  const [timerState, setTimerState] = useState<TimeStateProps>(timeStateConfig.notStarted);
  const [step, setStep] = useState<StepsProps>(0);

  const [currentFocusCicleTime] = useState(initialFocusCicleTime);
  const [currentShortBeakCicleTime] = useState(initialShortBeakCicleTime);
  const [currentLongBeakCicleTime] = useState(initialLongBeakCicleTime);

  const [counterCicleTime, setCounterCicleTime] = useState(initialCounterCicleTime);

  const handleStart = () => {
    setTimerState(timeStateConfig.running);
  };

  const handlePause = () => {
    setTimerState(timeStateConfig.paused);
  };

  const handleStop = () => {
    setStep(1);
    setTimerState(timeStateConfig.notStarted);
    setCounterCicleTime(initialCounterCicleTime);
  };

  const cicleTimeProgress = useMemo(() => {
    switch (currentStatus) {
      case currentStatusConfig.focus:
        return 100 - (counterCicleTime / currentFocusCicleTime) * 100;
      case currentStatusConfig.shortBreak:
        return 100 - (counterCicleTime / currentShortBeakCicleTime) * 100;
      case currentStatusConfig.longBreak:
        return 100 - (counterCicleTime / currentLongBeakCicleTime) * 100;

      default:
        return 0;
    }
  }, [currentStatus, counterCicleTime, currentShortBeakCicleTime, currentLongBeakCicleTime]);

  const isNotStarted = timerState === timeStateConfig.notStarted;
  const isRunning = timerState === timeStateConfig.running;
  const isPaused = timerState === timeStateConfig.paused;

  useEffect(() => {
    if (!isRunning) return;

    const ref = setInterval(() => {
      setCounterCicleTime((previous) => (previous <= 0 ? previous : previous - 1));
    }, 1000);

    return () => clearInterval(ref);
  }, [isRunning]);

  useEffect(() => {
    switch (currentStatus) {
      case currentStatusConfig.focus: {
        if (counterCicleTime > 0) break;

        if (step < 4) {
          setStep((previous) => (previous + 1) as StepsProps);
          setCurrentStatus(currentStatusConfig.shortBreak);
          setCounterCicleTime(currentShortBeakCicleTime);
        } else {
          setStep(0);
          setCurrentStatus(currentStatusConfig.longBreak);
          setCounterCicleTime(currentLongBeakCicleTime);
        }
        break;
      }

      case currentStatusConfig.shortBreak:
      case currentStatusConfig.longBreak: {
        if (counterCicleTime <= 0) {
          setCurrentStatus(currentStatusConfig.focus);
          setCounterCicleTime(currentFocusCicleTime);
        }
        break;
      }
    }
  }, [
    step,
    currentStatus,
    counterCicleTime,
    currentFocusCicleTime,
    currentLongBeakCicleTime,
    currentShortBeakCicleTime,
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
              fill={cicleTimeProgress}
              children={() => (
                <Text style={styles.progressText}>
                  {Math.floor(counterCicleTime / 60)}:
                  {(counterCicleTime % 60).toString().padStart(2, "0")}
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
