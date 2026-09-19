import type { RootStackParamList } from "./types";

export const routes = {
  Home: "Home",
  Settings: "Settings",
} as const satisfies Record<keyof RootStackParamList, keyof RootStackParamList>;
