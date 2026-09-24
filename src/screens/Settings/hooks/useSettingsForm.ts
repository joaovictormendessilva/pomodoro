import { useEffect, useState } from "react";

import { defaultSettings, loadSettings, saveSetting } from "@/services/storage-service";
import type { PomodoroSettings } from "@/services/types";

export function useSettingsForm() {
  const [settings, setSettings] = useState<PomodoroSettings | null>(null);

  useEffect(() => {
    loadSettings()
      .catch(() => defaultSettings)
      .then(setSettings);
  }, []);

  function setField<K extends keyof PomodoroSettings>(key: K, value: PomodoroSettings[K]) {
    if (!settings) return;

    setSettings({ ...settings, [key]: value });
    saveSetting(key, value);
  }

  return { settings, setField };
}
