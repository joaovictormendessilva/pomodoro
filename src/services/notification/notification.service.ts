import notifee, {
  AuthorizationStatus,
  Notification,
  NotificationSettings,
  TimestampTrigger,
} from "@notifee/react-native";
import { Alert, Platform } from "react-native";

import {
  CYCLES_IN_ONE_FULL_ROUND,
  notificationChannelConfig,
} from "@/constants/notification-settings";
import { CycleWithDates, getCurrentCycle, getNextCycles } from "@/helpers/get-cycles-with-dates";
import { updateStateByElapsedTime } from "@/helpers/update-state-by-elapsed-time";
import { loadAppState } from "@/services/storage/storage.service";
import { AppState } from "@/services/storage/storage.types";
import { createAndroidChannels } from "./notification.channels";
import {
  buildAndroidTimerNotification,
  buildIosNewCycleNotification,
} from "./notification.content";
import { buildTriggerForDate } from "./notification.trigger";

const isAndroid: boolean = Platform.OS === "android";
const isIos: boolean = Platform.OS === "ios";

const isPermissionAlreadyGranted = async (): Promise<boolean> => {
  const notificationSettings: NotificationSettings = await notifee.getNotificationSettings();
  const isGranted: boolean =
    notificationSettings.authorizationStatus === AuthorizationStatus.AUTHORIZED;

  return isGranted;
};

const requestPermission = async () => {
  const isAlreadyGranted: boolean = await isPermissionAlreadyGranted();
  if (isAlreadyGranted) return;

  const { authorizationStatus } = await notifee.requestPermission();

  if (authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
    Alert.alert("Permissão Negada", "A permissão para mostrar notificações foi negada.");
  }
};

const scheduleNotificationAtCycleStart = async (
  notification: Notification,
  cycle: CycleWithDates,
) => {
  const triggerAtCycleStart: TimestampTrigger = buildTriggerForDate(cycle.startDate);

  await notifee.createTriggerNotification(notification, triggerAtCycleStart);
};

const showSilentTimerForCurrentCycle = async (currentCycle: CycleWithDates) => {
  const silentChannelId: string = notificationChannelConfig.silent.id;
  const timerNotification: Notification = buildAndroidTimerNotification(
    currentCycle,
    silentChannelId,
  );

  await notifee.displayNotification(timerNotification);
};

const scheduleTimersWithSoundForNextCycles = async (nextCycles: CycleWithDates[]) => {
  const channelWithSoundId: string = notificationChannelConfig.withSound.id;

  for (const nextCycle of nextCycles) {
    const timerNotification: Notification = buildAndroidTimerNotification(
      nextCycle,
      channelWithSoundId,
    );

    await scheduleNotificationAtCycleStart(timerNotification, nextCycle);
  }
};

const scheduleIosAlertsForNextCycles = async (nextCycles: CycleWithDates[]) => {
  for (const nextCycle of nextCycles) {
    const newCycleNotification: Notification = buildIosNewCycleNotification(nextCycle);

    await scheduleNotificationAtCycleStart(newCycleNotification, nextCycle);
  }
};

const scheduleAndroidNotifications = async (
  currentCycle: CycleWithDates,
  nextCycles: CycleWithDates[],
) => {
  await createAndroidChannels();
  await showSilentTimerForCurrentCycle(currentCycle);
  await scheduleTimersWithSoundForNextCycles(nextCycles);
};

const scheduleIosNotifications = async (nextCycles: CycleWithDates[]) => {
  await scheduleIosAlertsForNextCycles(nextCycles);
};

const loadSavedTimerAndScheduleNotifications = async () => {
  const savedAppState: AppState | null = await loadAppState();
  if (!savedAppState) return;

  const updatedAppState: AppState = updateStateByElapsedTime(savedAppState);
  const currentDate: number = Date.now();
  const currentCycle: CycleWithDates = getCurrentCycle(updatedAppState, currentDate);
  const nextCycles: CycleWithDates[] = getNextCycles(
    currentCycle,
    updatedAppState,
    CYCLES_IN_ONE_FULL_ROUND,
  );

  if (isAndroid) {
    await scheduleAndroidNotifications(currentCycle, nextCycles);
  }

  if (isIos) {
    await scheduleIosNotifications(nextCycles);
  }
};

let schedulingInProgress: Promise<void> = Promise.resolve();

const scheduleTimerNotifications = async () => {
  schedulingInProgress = loadSavedTimerAndScheduleNotifications();

  await schedulingInProgress;
};

const cancelTimerNotifications = async () => {
  await schedulingInProgress;
  await notifee.cancelAllNotifications();
};

export const notificationService = {
  requestPermission,
  scheduleTimerNotifications,
  cancelTimerNotifications,
};
