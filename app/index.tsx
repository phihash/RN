import { Pressable, StyleSheet, Text, View } from "react-native";
import { Checklist, Item } from "../types";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ListNameLabel from "../components/ListNameLabel";
const deafaultList: Checklist = {
  id: "1",
  name: "デフォルト",
  items: [
    {
      id: "1",
      name: "財布",
      checked: false,
      icon: "wallet-outline",
    },
    {
      id: "2",
      name: "定期券",
      checked: false,
    },
  ],
};

export default function Home() {
  const [items, setItems] = useState<Item[]>(deafaultList.items);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>最初の画面</Text>
      <Text>右上の⚙をタップすると設定画面へ</Text>

      {items.map((item) => (
        <Pressable
          key={item.id}
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
            {item.icon && <Ionicons name={item.icon} size={20} color="#555" />}
          </Text>
          <ListNameLabel />
        </Pressable>
      ))}
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
