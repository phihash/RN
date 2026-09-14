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
          return <Text>{item}</Text>;
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
  tab: {
    flexDirection: "row",
    padding: 16,
  },
  grid: {
    padding: 16,
    gap: 12,
  },
});
