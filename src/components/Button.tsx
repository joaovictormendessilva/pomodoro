import { StyleSheet, Text, TouchableOpacity } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { theme } from "@/theme";

type ButtonVariant = "contained" | "outlined";
type ButtonColor = "primary" | "secondary";

type ButtonProps = {
  text: string;
  onPress: () => void;
  variant?: ButtonVariant;
  color?: ButtonColor;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const buttonColors = {
  primary: theme.colors.primary,
  secondary: theme.colors.divider,
} as const;

export function Button({
  text,
  onPress,
  variant = "contained",
  color = "primary",
  disabled = false,
  style,
}: ButtonProps) {
  const tone = buttonColors[color];

  const variantStyle = {
    contained: { borderColor: "transparent", backgroundColor: tone },
    outlined: { borderColor: tone },
  }[variant];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.buttonBase, variantStyle, disabled && styles.disabledButton, style]}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: "center",
  },

  buttonText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.interRegular,
  },

  disabledButton: {
    opacity: 0.5,
  },
});
