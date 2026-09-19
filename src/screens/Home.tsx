import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SCREENS } from "@/app-routes/constants/screens";
import type { NavigationScreenProps } from "@/app-routes/types/NavigationScreenProps";

export function HomeScreen() {
  const navigation = useNavigation<NavigationScreenProps>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SettingsScreen)}>
        <Text>Settings Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "red" },
  title: { fontSize: 52 },
});
