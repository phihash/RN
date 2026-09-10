import { StyleSheet, Text, View } from "react-native";

type ListNameLabelProps = {
  color?: string;
};

export default function ListNameLabel({ color }: ListNameLabelProps) {
  return (
    <View style={styles.chip}>
      <View style={(styles.square, color && { backgroundColor: color })} />
      <Text style={styles.name}>ラベル</Text>
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
