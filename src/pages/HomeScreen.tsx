import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationScreenProps } from "../app-routes/types/NavigationScreenProps";
import { SCREENS } from "../app-routes/constants/screens";

export function HomeScreen() {
  const navigation = useNavigation<NavigationScreenProps>();

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text style={{ fontSize: 52 }}>Home Screen</Text>

      <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SettingsScreen)}>
        <Text>Settings Screen</Text>
      </TouchableOpacity>
    </View>
  );
}
