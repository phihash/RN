import { Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import { Item } from "../types";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ListNameLabel from "../components/ListNameLabel";
import { defaultList } from "../data";

export default function Home() {
  const [items, setItems] = useState<Item[]>(defaultList.items);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>最初の画面</Text>
      <Text>右上の⚙をタップすると設定画面へ</Text>
      <Pressable onPress={() => {}}>メニュー</Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.listitem}
            onPress={() => {
              setItems(
                items.map((element) =>
                  element.id === item.id
                    ? { ...element, checked: !element.checked }
                    : element,
                ),
              );
            }}
          >
            <Text>
              {item.checked ? "✅" : "⬜️"}
              {item.name}{" "}
              {item.icon && (
                <Ionicons name={item.icon} size={20} color="#555" />
              )}
            </Text>
            <ListNameLabel />
          </Pressable>
        )}
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
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  listitem: { flexDirection: "row", gap: 8 },
});
