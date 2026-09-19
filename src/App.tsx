import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { AppRoutes } from "./app-routes/AppRoutes";
import { navigationTheme } from "@/theme/navigation-theme";

SplashScreen.preventAutoHideAsync();

export function App() {
  const [loaded, error] = useFonts({
    InterRegular: Inter_400Regular,
    InterBold: Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hide();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppRoutes />
    </NavigationContainer>
  );
}
