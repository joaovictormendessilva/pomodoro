import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/Button";
import { theme } from "@/theme";
import { useState } from "react";

export function SettingsScreen() {
  const navigation = useNavigation();

  const [focusPeriod, setFocusPeriod] = useState<number>(25);
  const [shortBreak, setShortBreak] = useState<number>(5);
  const [longBreak, setLongBreak] = useState<number>(15);
  const [notificationPeriod, setNotificationPeriod] = useState<boolean>(true);

  const changeFocusPeriod = (value: number) => setFocusPeriod(value);
  const changeShortBreak = (value: number) => setShortBreak(value);
  const changeLongBreak = (value: number) => setLongBreak(value);
  const changeNotificationPeriod = (value: boolean) => setNotificationPeriod(value);

  const isFocusPeriodActive = (value: number) => (focusPeriod === value ? "primary" : "secondary");
  const isShortBreakActive = (value: number) => (shortBreak === value ? "primary" : "secondary");
  const isLongBreakActive = (value: number) => (longBreak === value ? "primary" : "secondary");
  const isNotificationPeriodActive = (value: boolean) =>
    notificationPeriod === value ? "primary" : "secondary";

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.settingsIcon} onPress={() => navigation.goBack()}>
        <MaterialIcons name="close" size={28} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Configurações</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitleText}>Período de foco</Text>
          <View style={styles.formButtonsContainer}>
            <Button
              text="15 min"
              onPress={() => changeFocusPeriod(15)}
              color={isFocusPeriodActive(15)}
            />
            <Button
              text="25 min"
              onPress={() => changeFocusPeriod(25)}
              color={isFocusPeriodActive(25)}
            />
            <Button
              text="35 min"
              onPress={() => changeFocusPeriod(35)}
              color={isFocusPeriodActive(35)}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitleText}>Pausa curta</Text>
          <View style={styles.formButtonsContainer}>
            <Button
              text="3 min"
              onPress={() => changeShortBreak(3)}
              color={isShortBreakActive(3)}
            />
            <Button
              text="5 min"
              onPress={() => changeShortBreak(5)}
              color={isShortBreakActive(5)}
            />
            <Button
              text="7 min"
              onPress={() => changeShortBreak(7)}
              color={isShortBreakActive(7)}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitleText}>Pausa longa</Text>
          <View style={styles.formButtonsContainer}>
            <Button
              text="10 min"
              onPress={() => changeLongBreak(10)}
              color={isLongBreakActive(10)}
            />
            <Button
              text="15 min"
              onPress={() => changeLongBreak(15)}
              color={isLongBreakActive(15)}
            />
            <Button
              text="20 min"
              onPress={() => changeLongBreak(20)}
              color={isLongBreakActive(20)}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitleText}>Notificações</Text>
          <View style={styles.formButtonsContainerNotifications}>
            <Button
              text="Desativado"
              onPress={() => changeNotificationPeriod(false)}
              color={isNotificationPeriodActive(false)}
            />
            <Button
              text="Ativado"
              onPress={() => changeNotificationPeriod(true)}
              color={isNotificationPeriodActive(true)}
            />
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

  formContainer: { width: "80%", gap: 8 },

  formButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  formButtonsContainerNotifications: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  formTitleText: {
    fontSize: theme.fontSizes.label,
    fontFamily: theme.fonts.interRegular,
    color: theme.colors.text,
  },
});
