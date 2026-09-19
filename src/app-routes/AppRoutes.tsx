import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "@/screens/Home";
import { SettingsScreen } from "@/screens/Settings";

import { SCREENS } from "./constants/screens";

const Stack = createStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName={SCREENS.HomeScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SCREENS.HomeScreen} component={HomeScreen} />
      <Stack.Screen name={SCREENS.SettingsScreen} component={SettingsScreen} />
    </Stack.Navigator>
  );
}
