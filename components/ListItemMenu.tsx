import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SavedList } from "../storage/list";

type ListItemMenuProps = {
  listItem: SavedList;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export default function ListItemMenu({
  listItem,
  onClose,
  onRename,
  onDelete,
}: ListItemMenuProps) {
  return (
    <View style={styles.menu}>
      <Text style={styles.menuTitle} numberOfLines={1}>
        {listItem.name}
      </Text>
      <Pressable accessibilityRole="button" onPress={onRename}>
        <View style={styles.menuOption}>
          <Ionicons name="create-outline" size={22} color="#4a90d9" />
          <Text style={styles.menuOptionText}>リスト名を変更</Text>
        </View>
      </Pressable>

      <View style={styles.menuOption}>
        <Ionicons name="add-circle-outline" size={22} color="#4a90d9" />
        <Text style={styles.menuOptionText}>リストにアイテムを追加する</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onDelete}>
        <View style={styles.menuOption}>
          <Ionicons name="trash-outline" size={22} color="#c54b4b" />
          <Text style={styles.deleteText}>リストを削除する</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={onClose}
        accessibilityRole="button"
      >
        <Text style={styles.cancelText}>キャンセル</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
  },
  menuTitle: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#263f4d",
  },
  menuOption: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#eef2f5",
  },
  menuOptionText: {
    fontSize: 16,
    color: "#263f4d",
  },
  deleteText: {
    fontSize: 16,
    color: "#c54b4b",
  },
  cancelButton: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: "#eef4f8",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5a7684",
  },
});
