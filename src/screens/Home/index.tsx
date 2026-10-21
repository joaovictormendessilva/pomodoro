import { useEffect } from "react";

import { useAppState } from "@/hooks/useAppState";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { notificationService } from "@/services/notification/notification.service";
import { PomodoroTimer } from "./components/PomodoroTimer";

export function HomeScreen() {
  const { settings } = usePomodoroSettings();
  const { appState, loadingAppState } = useAppState();

  const isNotificationEnabled: boolean = settings?.notificationPeriod === true;

  useEffect(() => {
    if (!isNotificationEnabled) return;

    notificationService.requestPermission();
  }, [isNotificationEnabled]);

  if (!settings || loadingAppState) return;

  return <PomodoroTimer key={appState?.dateNow} settings={settings} appState={appState} />;
}
