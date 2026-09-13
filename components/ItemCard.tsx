import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconName } from "../types";

type ItemCardProps = {
  name: string;
  icon?: IconName;
};

export default function ItemCard({ name, icon }: ItemCardProps) {
  return (
    <View style={styles.chip}>
      <Text>{icon && <Ionicons name={icon} size={24} color="#555" />}</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
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
