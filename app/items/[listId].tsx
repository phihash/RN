import { StyleSheet, Text, View, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../storage/list";
import ItemRow from "../../components/ItemRow";

export default function Items() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const numericListId = Number(listId);

  const { data: items = [] } = useQuery({
    queryKey: ["items", numericListId],
    queryFn: () => getItems(numericListId),
    enabled: Number.isInteger(numericListId),
  });
  return (
    <View style={styles.container}>
      <Text>リストID{listId}</Text>
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <ItemRow name={item.name} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>アイテムはありません</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
  grid: {
    padding: 16,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#5a7684",
    fontSize: 16,
  },
});
