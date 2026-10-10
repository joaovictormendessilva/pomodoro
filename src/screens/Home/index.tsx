import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { PomodoroTimer } from "./components/PomodoroTimer";

export function HomeScreen() {
  const { settings } = usePomodoroSettings();

  if (!settings) return;

  return <PomodoroTimer settings={settings} />;
}
