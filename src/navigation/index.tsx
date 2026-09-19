import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "@/screens/Home";
import { SettingsScreen } from "@/screens/Settings";
import { navigationTheme } from "@/theme/navigation-theme";

import { routes } from "./routes";
import type { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName={routes.Home} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={routes.Home} component={HomeScreen} />
        <Stack.Screen name={routes.Settings} component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
