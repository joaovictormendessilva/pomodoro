import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/Button";
import { theme } from "@/theme";

export function SettingsScreen() {
  const navigation = useNavigation();

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
            <Button text="15 min" onPress={() => {}} color="secondary" />
            <Button text="25 min" onPress={() => {}} />
            <Button text="35 min" onPress={() => {}} color="secondary" />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitleText}>Pausa curta</Text>
          <View style={styles.formButtonsContainer}>
            <Button text="3 min" onPress={() => {}} color="secondary" />
            <Button text="5 min" onPress={() => {}} />
            <Button text="7 min" onPress={() => {}} color="secondary" />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitleText}>Pausa longa</Text>
          <View style={styles.formButtonsContainer}>
            <Button text="10 min" onPress={() => {}} color="secondary" />
            <Button text="15 min" onPress={() => {}} />
            <Button text="20 min" onPress={() => {}} color="secondary" />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitleText}>Notificações</Text>
          <View style={styles.formButtonsContainerNotifications}>
            <Button text="Desativado" onPress={() => {}} color="secondary" />
            <Button text="Ativado" onPress={() => {}} />
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
