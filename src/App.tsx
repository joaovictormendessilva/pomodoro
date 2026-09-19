import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppRoutes } from "./app-routes/AppRoutes";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { THEME } from "./themes/theme";

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
          bold: {
            fontWeight: "700",
            fontFamily: THEME.fonts.interBold,
          },
          regular: {
            fontWeight: "500",
            fontFamily: THEME.fonts.interRegular,
          },
        },
        colors: {
          ...DefaultTheme.colors,
          background: THEME.colors.background,
          primary: THEME.colors.primary,
          text: THEME.colors.text,
          card: THEME.colors.divider,
        },
      }}
    >
      <AppRoutes />
    </NavigationContainer>
  );
}
