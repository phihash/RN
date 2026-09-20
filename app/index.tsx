import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Item } from "../types";
import { useState } from "react";
import { defaultItems } from "../data";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ListForm from "../components/ListForm";
import { getLists, SavedList } from "../storage/list";

export default function Home() {
  const [lists, setLists] = useState<SavedList[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>リストはありません</Text>
      </View>
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setShowForm(true);
          }}
          style={({ pressed }) => [
            styles.menuButton,
            pressed && styles.menuButtonPressed,
          ]}
        >
          <Text style={styles.menuButtonText}>リスト作成</Text>
        </Pressable>
      </View>
      <Modal
        visible={showForm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowForm(false)}
            accessibilityLabel="フォームを閉じる"
          />
          <ListForm onClose={() => setShowForm(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(19, 35, 47, 0.45)",
  },
});
