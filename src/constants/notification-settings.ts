export const CYCLES_IN_ONE_FULL_ROUND = 8;

export const HIDE_TIMER_BEFORE_NEGATIVE_TIME_IN_MILLISECONDS = 1000;

export const notificationChannelConfig = {
  silent: {
    id: "pomodoro-silent",
    name: "Cronômetro ao bloquear a tela",
  },
  withSound: {
    id: "pomodoro-with-sound",
    name: "Início de um novo ciclo",
  },
} as const;

export const notificationIdPrefixConfig = {
  timer: "pomodoro-timer-",
  newCycle: "pomodoro-new-cycle-",
} as const;

export const notificationPressActionConfig = {
  openApp: { id: "default" },
} as const;

export const notificationSoundConfig = {
  systemDefault: "default",
} as const;
