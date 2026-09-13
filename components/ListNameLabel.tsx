import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconName } from "../types";

type ListNameLabelProps = {
  color?: string;
  listname?: string;
  iconName?: IconName;
};

export default function ListNameLabel({
  color,
  listname,
  iconName,
}: ListNameLabelProps) {
  return (
    <View style={styles.chip}>
      <View style={[styles.square, color && { backgroundColor: color }]} />
      <Text style={styles.name}>{listname ?? "ラベル"}</Text>
      <Text>
        {iconName && <Ionicons name={iconName} size={20} color="#555" />}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#dbe4ea",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  square: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#9b59b6",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5a7684",
  },
});
