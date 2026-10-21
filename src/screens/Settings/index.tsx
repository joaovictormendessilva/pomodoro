import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import { theme } from "@/theme";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { OptionGroup } from "./components/OptionGroup";

type DurationOption = {
  label: string;
  value: number;
};

const SECONDS_IN_ONE_MINUTE = 60;
const FOCUS_PERIOD_TEST_SECONDS = 30;
const SHORT_BREAK_TEST_SECONDS = 15;
const LONG_BREAK_TEST_SECONDS = 45;

const focusPeriodTestOption: DurationOption = {
  label: "30 seg (teste)",
  value: FOCUS_PERIOD_TEST_SECONDS / SECONDS_IN_ONE_MINUTE,
};
const focusPeriodRealOptions: DurationOption[] = [
  { label: "15 min", value: 15 },
  { label: "25 min", value: 25 },
  { label: "35 min", value: 35 },
];
const focusPeriodOptions: DurationOption[] = __DEV__
  ? [focusPeriodTestOption].concat(focusPeriodRealOptions)
  : focusPeriodRealOptions;

const shortBreakTestOption: DurationOption = {
  label: "15 seg (teste)",
  value: SHORT_BREAK_TEST_SECONDS / SECONDS_IN_ONE_MINUTE,
};
const shortBreakRealOptions: DurationOption[] = [
  { label: "3 min", value: 3 },
  { label: "5 min", value: 5 },
  { label: "7 min", value: 7 },
];
const shortBreakOptions: DurationOption[] = __DEV__
  ? [shortBreakTestOption].concat(shortBreakRealOptions)
  : shortBreakRealOptions;

const longBreakTestOption: DurationOption = {
  label: "45 seg (teste)",
  value: LONG_BREAK_TEST_SECONDS / SECONDS_IN_ONE_MINUTE,
};
const longBreakRealOptions: DurationOption[] = [
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "20 min", value: 20 },
];
const longBreakOptions: DurationOption[] = __DEV__
  ? [longBreakTestOption].concat(longBreakRealOptions)
  : longBreakRealOptions;

const notificationOptions = [
  { label: "Desativado", value: false },
  { label: "Ativado", value: true },
];

export function SettingsScreen() {
  const navigation = useNavigation();
  const { settings, setField } = usePomodoroSettings();

  return (
    <View style={styles.mainContainer}>
      <IconButton
        icon="close"
        accessibilityLabel="Fechar configurações"
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      />

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Configurações</Text>
        </View>

        <OptionGroup
          title="Período de foco"
          options={focusPeriodOptions}
          selected={settings?.focusPeriod}
          onSelect={(value) => setField("focusPeriod", value)}
        />

        <OptionGroup
          title="Pausa curta"
          options={shortBreakOptions}
          selected={settings?.shortBreak}
          onSelect={(value) => setField("shortBreak", value)}
        />

        <OptionGroup
          title="Pausa longa"
          options={longBreakOptions}
          selected={settings?.longBreak}
          onSelect={(value) => setField("longBreak", value)}
        />

        <OptionGroup
          title="Notificações"
          options={notificationOptions}
          selected={settings?.notificationPeriod}
          onSelect={(value) => setField("notificationPeriod", value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  closeButton: {
    alignSelf: "flex-end",
  },
  container: {
    gap: 36,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.title,
    fontFamily: theme.fonts.interBold,
  },
});
