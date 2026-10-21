import { AndroidVisibility, Notification } from "@notifee/react-native";

import { cycleTitleConfig } from "@/constants/app-settings";
import {
  HIDE_TIMER_BEFORE_NEGATIVE_TIME_IN_MILLISECONDS,
  notificationIdPrefixConfig,
  notificationPressActionConfig,
  notificationSoundConfig,
} from "@/constants/notification-settings";
import { CycleWithDates } from "@/helpers/get-cycles-with-dates";

export const buildAndroidTimerNotification = (
  cycle: CycleWithDates,
  channelId: string,
): Notification => {
  const cycleDurationInMilliseconds: number = cycle.endDate - cycle.startDate;
  const timeUntilTimerIsHidden: number =
    cycleDurationInMilliseconds - HIDE_TIMER_BEFORE_NEGATIVE_TIME_IN_MILLISECONDS;

  const timerNotification: Notification = {
    id: notificationIdPrefixConfig.timer + cycle.cycleNumber,
    title: cycleTitleConfig[cycle.status],
    body: "Tempo restante do ciclo",
    android: {
      channelId: channelId,
      pressAction: notificationPressActionConfig.openApp,
      visibility: AndroidVisibility.PUBLIC,
      ongoing: true,
      onlyAlertOnce: true,
      showChronometer: true,
      chronometerDirection: "down",
      timestamp: cycle.endDate,
      timeoutAfter: timeUntilTimerIsHidden,
    },
  };

  return timerNotification;
};

export const buildIosNewCycleNotification = (cycle: CycleWithDates): Notification => {
  const newCycleNotification: Notification = {
    id: notificationIdPrefixConfig.newCycle + cycle.cycleNumber,
    title: cycleTitleConfig[cycle.status],
    body: "O ciclo anterior terminou",
    ios: {
      sound: notificationSoundConfig.systemDefault,
    },
  };

  return newCycleNotification;
};
