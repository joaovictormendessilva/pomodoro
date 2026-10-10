import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import { theme } from "@/theme";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { OptionGroup } from "./components/OptionGroup";

const focusPeriodOptions = [
  { label: "15 min", value: 15 },
  { label: "25 min", value: 25 },
  { label: "35 min", value: 35 },
];

const shortBreakOptions = [
  { label: "3 min", value: 3 },
  { label: "5 min", value: 5 },
  { label: "7 min", value: 7 },
];

const longBreakOptions = [
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "20 min", value: 20 },
];

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
