import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconName } from "../types";

type ItemRowProps = {
  name: string;
  icon?: IconName;
  onPress?: () => void;
};

export default function ItemRow({ name, icon, onPress }: ItemRowProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.row}>
        <Text>{icon && <Ionicons name={icon} size={24} color="#555" />}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
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
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5a7684",
  },
});
