import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ListItemMenuProps = {
  listName: string;
  visible: boolean;
  onClose: () => void;
};

export default function ListItemMenu({
  listName,
  visible,
  onClose,
}: ListItemMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="メニューを閉じる"
        />
        <View style={styles.menu}>
          <Text style={styles.menuTitle} numberOfLines={1}>
            {listName}
          </Text>
          <View style={styles.menuOption}>
            <Ionicons name="create-outline" size={22} color="#4a90d9" />
            <Text style={styles.menuOptionText}>リスト名を変更</Text>
          </View>
          <View style={styles.menuOption}>
            <Ionicons name="add-circle-outline" size={22} color="#4a90d9" />
            <Text style={styles.menuOptionText}>リストにアイテムを追加する</Text>
          </View>
          <View style={styles.menuOption}>
            <Ionicons name="trash-outline" size={22} color="#c54b4b" />
            <Text style={styles.deleteText}>リストを削除する</Text>
          </View>
          <Pressable
            style={styles.cancelButton}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>キャンセル</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(19, 35, 47, 0.45)",
  },
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
