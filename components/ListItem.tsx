import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SavedList } from "../storage/list";
import { useState } from "react";
import ListItemMenu from "./ListItemMenu";

type ListItemProps = {
  item: SavedList;
};

export default function ListItem({ item }: ListItemProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <View style={styles.listCard}>
        <Text style={styles.listName} numberOfLines={2}>
          {item.name}
        </Text>
        <Pressable
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}のメニューを開く`}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#4a90d9" />
        </Pressable>
      </View>

      <ListItemMenu
        visible={menuVisible}
        listName={item.name}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#dbe4ea",
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#eaf4fc",
  },
  listName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#263f4d",
  },
});
