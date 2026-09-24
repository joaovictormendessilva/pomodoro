import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PomodoroSettings } from "./types";

export const defaultSettings: PomodoroSettings = {
  focusPeriod: 25,
  shortBreak: 5,
  longBreak: 15,
  notificationPeriod: true,
};

const storageKeys: Record<keyof PomodoroSettings, string> = {
  focusPeriod: "FOCUS_PERIOD",
  shortBreak: "SHORT_BREAK",
  longBreak: "LONG_BREAK",
  notificationPeriod: "NOTIFICATION_PERIOD",
};

export async function loadSettings(): Promise<PomodoroSettings> {
  const [focusPeriod, shortBreak, longBreak, notificationPeriod] = await Promise.all([
    AsyncStorage.getItem(storageKeys.focusPeriod),
    AsyncStorage.getItem(storageKeys.shortBreak),
    AsyncStorage.getItem(storageKeys.longBreak),
    AsyncStorage.getItem(storageKeys.notificationPeriod),
  ]);

  return {
    focusPeriod: focusPeriod ? Number(focusPeriod) : defaultSettings.focusPeriod,
    shortBreak: shortBreak ? Number(shortBreak) : defaultSettings.shortBreak,
    longBreak: longBreak ? Number(longBreak) : defaultSettings.longBreak,
    notificationPeriod: notificationPeriod
      ? notificationPeriod === "true"
      : defaultSettings.notificationPeriod,
  };
}

export function saveSetting<K extends keyof PomodoroSettings>(key: K, value: PomodoroSettings[K]) {
  return AsyncStorage.setItem(storageKeys[key], JSON.stringify(value));
}
