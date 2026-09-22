import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getListItems,
  getList,
  toggleListItemChecked,
} from "../../storage/list";
import ItemRow from "../../components/ItemRow";
import { defaultItems } from "../../data";

export default function Items() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const numericListId = Number(listId);
  const isValidListId = Number.isInteger(numericListId);
  const queryClient = useQueryClient();

  const { data: list } = useQuery({
    queryKey: ["lists", numericListId],
    queryFn: () => getList(numericListId),
    enabled: isValidListId,
  });

  const { data: items = [] } = useQuery({
    queryKey: ["list-items", numericListId],
    queryFn: () => getListItems(numericListId),
    enabled: isValidListId,
  });
  return (
    <>
      <Stack.Screen
        options={{
          title: list?.name ?? "",
          headerRight: () => (
            <Link
              href={{
                pathname: "/item-catalog",
                params: { listId: String(numericListId) },
              }}
              asChild
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="アイテムを追加"
              >
                <Ionicons name="add-outline" size={28} color="#fff" />
              </Pressable>
            </Link>
          ),
        }}
      />
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
              selected={item.checked === 1}
              icon={
                item.icon ??
                defaultItems.find(
                  (catalogItem) => catalogItem.name === item.name,
                )?.icon
              }
              onPress={async () => {
                try {
                  const updated = await toggleListItemChecked(item.id);
                  if (!updated) {
                    Alert.alert("アイテムが見つかりませんでした");
                    return;
                  }
                  await queryClient.invalidateQueries({
                    queryKey: ["list-items", numericListId],
                  });
                } catch (error) {
                  console.error("チェック状態の更新に失敗しました", error);
                  Alert.alert("チェック状態を更新できませんでした");
                }
              }}
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
