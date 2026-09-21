import { StyleSheet, Text, View, FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getItems, getList } from "../../storage/list";
import ItemRow from "../../components/ItemRow";
import { defaultItems } from "../../data";

export default function Items() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const numericListId = Number(listId);
  const isValidListId = Number.isInteger(numericListId);

  const { data: list } = useQuery({
    queryKey: ["lists", numericListId],
    queryFn: () => getList(numericListId),
    enabled: isValidListId,
  });

  const { data: items = [] } = useQuery({
    queryKey: ["items", numericListId],
    queryFn: () => getItems(numericListId),
    enabled: isValidListId,
  });
  return (
    <>
      <Stack.Screen options={{ title: list?.name ?? "アイテム" }} />
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            styles.grid,
            items.length === 0 && styles.emptyList,
          ]}
          renderItem={({ item }) => (
            <ItemRow
              name={item.name}
              icon={
                item.icon ??
                defaultItems.find((catalogItem) => catalogItem.name === item.name)
                  ?.icon
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>アイテムはありません</Text>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
