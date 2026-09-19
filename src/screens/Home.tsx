import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialIcons } from "@expo/vector-icons";

import { Button } from "@/components/Button";
import { theme } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import { routes } from "@/navigation/routes";

export function HomeScreen() {
  const navigation = useNavigation();

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
            <Text style={styles.stateText}>Clique em iniciar</Text>
            <Text style={styles.stateText}>Hora de se concentrar</Text>
            <Text style={styles.stateText}>Pausa curta</Text>
            <Text style={styles.stateText}>Pausa longa</Text>
            <Text style={styles.stateText}>Cronômetro em pausa</Text>
          </View>

          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={160}
              width={7}
              fill={10}
              tintColor={theme.colors.primary}
              rotation={0}
              backgroundColor={theme.colors.divider}
              children={() => <Text style={styles.progressText}>12:45</Text>}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button text="Iniciar" onPress={() => {}} />
          </View>

          <View style={styles.pomodorosContainer}>
            <Text style={styles.pomodoroText}>Pomodoros:</Text>

            <View style={styles.pomodoroDotCompleted} />
            <View style={styles.pomodoroDotCompleted} />
            <View style={styles.pomodoroDot} />
            <View style={styles.pomodoroDot} />
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
