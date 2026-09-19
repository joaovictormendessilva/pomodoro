import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { routes } from "@/navigation/routes";
import type { RootStackNavigationProp } from "@/navigation/types";

export function HomeScreen() {
  const navigation = useNavigation<RootStackNavigationProp<"Home">>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <TouchableOpacity onPress={() => navigation.navigate(routes.Settings)}>
        <Text>Settings Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "red" },
  title: { fontSize: 52 },
});
