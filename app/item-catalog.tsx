import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import ItemRow from "../components/ItemRow";
import { defaultItems } from "../data";
import { useState } from "react";
import { CATEGORIES, Category } from "../types";
import { useLocalSearchParams } from "expo-router";
import { addItem } from "../storage/list";
import { useQueryClient } from "@tanstack/react-query";

export default function ItemCatalog() {
  const [selectTab, setSelectTab] = useState<Category>("貴重品");
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const numericListId = Number(listId);
  const queryClient = useQueryClient();
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.tabScroll}
        showsHorizontalScrollIndicator={false} // 下に出るスクロールバーを非表示（見た目用）
        contentContainerStyle={styles.tab}
      >
        {CATEGORIES.map((item) => {
          return (
            <Pressable
              onPress={() => {
                setSelectTab(item);
              }}
              key={item}
              style={[
                styles.tabItem,
                item === selectTab && styles.tabItemActive,
              ]}
            >
              <Text
                style={[
                  styles.tabItemText,
                  item === selectTab && styles.tabItemTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        style={styles.list}
        data={defaultItems.filter((data) => {
          return data.category === selectTab;
        })}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ItemRow
            name={item.name}
            icon={item.icon}
            onPress={async () => {
              try {
                const result = await addItem(
                  numericListId,
                  item.name,
                  item.icon,
                );

                if (!result) {
                  Alert.alert("アイテムの追加に失敗しました");
                  return;
                }

                await queryClient.invalidateQueries({
                  queryKey: ["items", numericListId],
                });
              } catch (error) {
                console.error("アイテムの追加に失敗しました", error);
                Alert.alert("アイテムの追加に失敗しました");
              }
            }}
          />
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
  tabScroll: {
    height: 72,
    flexGrow: 0,
    flexShrink: 0,
  },
  list: {
    flex: 1,
  },

  tabItem: {
    borderWidth: 1.5,
    borderColor: "#dbe4ea",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  tabItemActive: {
    borderColor: "#4aabeb",
  },
  tabItemText: {
    lineHeight: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "#5a7684",
  },
  tabItemTextActive: {
    color: "#4aabeb",
  },
  tab: {
    gap: 4,
    flexDirection: "row",
    padding: 16,
  },
  grid: {
    padding: 16,
    gap: 12,
  },
});
