import { Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import { Item } from "../types";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ListNameLabel from "../components/ListNameLabel";
import { defaultItems } from "../data";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const [items, setItems] = useState<Item[]>(defaultItems);
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>最初の画面</Text>
      <Text style={styles.description}>右上の⚙をタップすると設定画面へ</Text>
      <FlatList
        style={styles.list}
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
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            router.push("/menu");
          }}
          style={({ pressed }) => [styles.menuButton, pressed && styles.menuButtonPressed]}
        >
          <Text style={styles.menuButtonText}>メニュー</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
  },
  description: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  list: {
    flex: 1,
    alignSelf: "stretch",
    marginHorizontal: 16,
  },
  listitem: { flexDirection: "row", gap: 8 },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#dbe4ea",
  },
  menuButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#4a90d9",
  },
  menuButtonPressed: {
    opacity: 0.75,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
