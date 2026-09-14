import { FlatList, StyleSheet, View, Text } from "react-native";
import ItemRow from "../components/ItemRow";
import { defaultItems } from "../data";
import { useState } from "react";
import { CATEGORIES } from "../types";

export default function Menu() {
  const [selectTab, setSelectTab] = useState("化粧品");
  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        {CATEGORIES.map((item) => {
          return (
            <Text key={item} style={styles.tabItem}>
              {item}
            </Text>
          );
        })}
      </View>

      <FlatList
        data={defaultItems}
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
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#dbe4ea",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontSize: 14,
    fontWeight: "600",
    color: "#5a7684",
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
