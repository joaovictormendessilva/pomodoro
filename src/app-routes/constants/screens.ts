import { ScreenDefinitions } from "../types/ScreenDefinitions";

export const SCREENS: Record<keyof ScreenDefinitions, keyof ScreenDefinitions> = {
  HomeScreen: "HomeScreen",
  SettingsScreen: "SettingsScreen",
};
