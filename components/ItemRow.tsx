import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconName } from "../types";

type ItemRowProps = {
  name: string;
  icon?: IconName;
  onPress?: () => void;
  selected?: boolean;
};

export default function ItemRow({
  name,
  icon,
  onPress,
  selected = false,
}: ItemRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={onPress ? { selected } : undefined}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}
    >
      <Text>{icon && <Ionicons name={icon} size={24} color="#555" />}</Text>
      <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
      {selected && (
        <Ionicons
          style={styles.checkIcon}
          name="checkmark-circle"
          size={24}
          color="#4a90d9"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#dbe4ea",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
  },
  rowSelected: {
    borderColor: "#4a90d9",
    backgroundColor: "#eaf4fc",
  },
  rowPressed: {
    opacity: 0.7,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5a7684",
  },
  nameSelected: {
    color: "#263f4d",
  },
  checkIcon: {
    marginLeft: "auto",
  },
});
