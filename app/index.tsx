import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ListForm from "../components/ListForm";
import { getLists } from "../storage/list";

export default function Home() {
  const { data: lists = [], isPending, isError } = useQuery({
    queryKey: ["lists"],
    queryFn: getLists,
    retry: false,
  });
  const [showForm, setShowForm] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isPending ? (
          <ActivityIndicator color="#4a90d9" />
        ) : isError ? (
          <Text>リストを読み込めませんでした</Text>
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={lists.length === 0 ? styles.emptyList : undefined}
            data={lists}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <Text style={styles.listName}>{item.name}</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>リストはありません</Text>}
          />
        )}
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
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  listName: {
    paddingVertical: 16,
    fontSize: 18,
    color: "#263f4d",
  },
  emptyText: {
    textAlign: "center",
    color: "#5a7684",
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
