import { useAppState } from "@/hooks/useAppState";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { PomodoroTimer } from "./components/PomodoroTimer";

export function HomeScreen() {
  const { settings } = usePomodoroSettings();
  const { appState, loadingAppState } = useAppState();

  if (!settings || loadingAppState) return;

  return <PomodoroTimer settings={settings} appState={appState} />;
}
