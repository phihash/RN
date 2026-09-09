import { Pressable, StyleSheet, Text, View } from "react-native";
import { Checklist, Item } from "../types";
import { useState } from "react";

const deafaultList: Checklist = {
  id: "1",
  name: "デフォルト",
  items: [
    {
      id: "1",
      name: "財布",
      checked: false,
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
          <Text>{item.checked ? "✅" : "⬜️"}</Text>

          <Text>{item.name} </Text>
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
});
