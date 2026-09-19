import { DarkTheme, type Theme } from "@react-navigation/native";

import { theme } from "./index";

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.divider,
    text: theme.colors.text,
  },
  fonts: {
    regular: { fontFamily: theme.fonts.interRegular, fontWeight: "400" },
    medium: { fontFamily: theme.fonts.interRegular, fontWeight: "400" },
    bold: { fontFamily: theme.fonts.interBold, fontWeight: "700" },
    heavy: { fontFamily: theme.fonts.interBold, fontWeight: "700" },
  },
};
