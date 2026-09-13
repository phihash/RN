import { FlatList, StyleSheet, View } from "react-native";
import ItemRow from "../components/ItemRow";
import { defaultItems } from "../data";

export default function Menu() {
  return (
    <View style={styles.container}>
      <FlatList
        data={defaultItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ItemRow name={item.name} icon={item.icon} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  grid: {
    padding: 16,
    gap: 12,
  },
});
