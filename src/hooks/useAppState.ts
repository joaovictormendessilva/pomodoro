import { appVisibilityConfig } from "@/constants/app-settings";
import { updateStateByElapsedTime } from "@/helpers/update-state-by-elapsed-time";
import { loadAppState } from "@/services/storage/storage.service";
import { AppState } from "@/services/storage/storage.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { type AppStateStatus, AppState as RNAppState } from "react-native";

export const useAppState = () => {
  const [loadingAppState, setLoadingAppState] = useState<boolean>(true);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [reactNativeAppState, setReactNativeAppState] = useState<AppStateStatus>(
    RNAppState.currentState,
  );

  const shouldUpdateAfterBackground = useRef<boolean>(true);

  const handleLoadAppState = useCallback(async () => {
    return await loadAppState();
  }, []);

  useEffect(() => {
    const listener = RNAppState.addEventListener("change", setReactNativeAppState);

    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (shouldUpdateAfterBackground.current) {
      shouldUpdateAfterBackground.current = false;

      handleLoadAppState()
        .then((appStateAsync) => {
          if (appStateAsync) {
            const updateState = updateStateByElapsedTime(appStateAsync);
            setAppState(updateState);
            return;
          }

          setAppState(appStateAsync);
        })
        .finally(() => setLoadingAppState(false));
    }

    if (reactNativeAppState === appVisibilityConfig.background) {
      shouldUpdateAfterBackground.current = true;
    }
  }, [reactNativeAppState]);

  return { appState, loadingAppState };
};
