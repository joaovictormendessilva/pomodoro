import notifee, { AndroidImportance, AndroidVisibility } from "@notifee/react-native";

import {
  notificationChannelConfig,
  notificationSoundConfig,
} from "@/constants/notification-settings";

const createSilentChannel = async () => {
  await notifee.createChannel({
    id: notificationChannelConfig.silent.id,
    name: notificationChannelConfig.silent.name,
    importance: AndroidImportance.DEFAULT,
    visibility: AndroidVisibility.PUBLIC,
    vibration: false,
  });
};

const createChannelWithSound = async () => {
  await notifee.createChannel({
    id: notificationChannelConfig.withSound.id,
    name: notificationChannelConfig.withSound.name,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    vibration: true,
    sound: notificationSoundConfig.systemDefault,
  });
};

export const createAndroidChannels = async () => {
  await createSilentChannel();
  await createChannelWithSound();
};
