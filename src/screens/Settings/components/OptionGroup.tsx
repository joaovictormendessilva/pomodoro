import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { theme } from "@/theme";

type Option<T> = {
  label: string;
  value: T;
};

type OptionGroupProps<T> = {
  title: string;
  options: Option<T>[];
  selected: T | undefined;
  onSelect: (value: T) => void;
};

export function OptionGroup<T extends number | boolean>({
  title,
  options,
  selected,
  onSelect,
}: OptionGroupProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.buttonsContainer}>
        {options.map((option) => (
          <Button
            key={option.label}
            text={option.label}
            onPress={() => onSelect(option.value)}
            color={selected === option.value ? "primary" : "secondary"}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "80%", gap: 8 },

  titleText: {
    fontSize: theme.fontSizes.label,
    fontFamily: theme.fonts.interRegular,
    color: theme.colors.text,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
