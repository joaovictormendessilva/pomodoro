import { TimestampTrigger, TriggerType } from "@notifee/react-native";

export const buildTriggerForDate = (date: number): TimestampTrigger => {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  return trigger;
};
