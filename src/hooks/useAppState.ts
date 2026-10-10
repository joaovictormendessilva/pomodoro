import { loadAppState } from "@/services/storage-service";
import { AppState } from "@/services/types";
import { useCallback, useEffect, useState } from "react";

export const useAppState = () => {
  const [loadingAppState, setLoadingAppState] = useState<boolean>(true);
  const [appState, setAppState] = useState<AppState | null>(null);

  const handleLoadAppState = useCallback(async () => {
    return await loadAppState();
  }, []);

  useEffect(() => {
    handleLoadAppState()
      .then((appStateAsync) => setAppState(appStateAsync))
      .finally(() => setLoadingAppState(false));
  }, []);

  return { appState, loadingAppState };
};
