import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { AppRoutes } from "./app-routes/AppRoutes";
import { theme } from "@/theme";

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
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        fonts: {
          ...DefaultTheme.fonts,
          bold: { fontWeight: "700", fontFamily: theme.fonts.interBold },
          regular: { fontWeight: "500", fontFamily: theme.fonts.interRegular },
        },
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background,
          primary: theme.colors.primary,
          text: theme.colors.text,
          card: theme.colors.divider,
        },
      }}
    >
      <AppRoutes />
    </NavigationContainer>
  );
}
