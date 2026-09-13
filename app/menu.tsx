import { FlatList, StyleSheet, View } from "react-native";
import ItemCard from "../components/ItemCard";
import { defaultItems } from "../data";

export default function Menu() {
  return (
    <View style={styles.container}>
      <FlatList
        data={defaultItems}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ItemCard name={item.name} icon={item.icon} />
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
  row: {
    gap: 12,
  },
});
