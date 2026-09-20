import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import ItemRow from "../components/ItemRow";
import { defaultItems } from "../data";
import { useState } from "react";
import { CATEGORIES, Category } from "../types";

export default function ItemCatalog() {
  const [selectTab, setSelectTab] = useState<Category>("貴重品");
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
        renderItem={({ item }) => <ItemRow name={item.name} icon={item.icon} />}
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
