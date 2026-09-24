import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { theme } from "@/theme";

type IconButtonProps = {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ icon, accessibilityLabel, onPress, style }: IconButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <MaterialIcons name={icon} size={28} color={theme.colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
  },
});
