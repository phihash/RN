import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ListForm from "../components/ListForm";
import ListItem from "../components/ListItem";
import { deleteList, getLists, type SavedList } from "../storage/list";
import UpdateListForm from "../components/UpdateListForm";
import ListItemMenu from "../components/ListItemMenu";

type ActiveOverlay =
  | { kind: "create" }
  | { kind: "menu"; list: SavedList }
  | { kind: "rename"; list: SavedList }
  | null;

export default function Home() {
  const {
    data: lists = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["lists"],
    queryFn: getLists,
    retry: false,
  });
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const closeOverlay = () => setActiveOverlay(null);

  const confirmDelete = (list: SavedList) => {
    Alert.alert(
      "リストを削除しますか？",
      `「${list.name}」を削除します。この操作は取り消せません。`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            try {
              const deleted = await deleteList(list.id);
              if (!deleted) {
                Alert.alert("削除できませんでした", "リストが見つかりません。");
                return;
              }
              closeOverlay();
              await queryClient.invalidateQueries({ queryKey: ["lists"] });
            } catch (error) {
              console.error("リストの削除に失敗しました", error);
              Alert.alert("削除できませんでした", "もう一度お試しください。");
            }
          },
        },
      ],
    );
  };

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
            contentContainerStyle={[
              styles.listContent,
              lists.length === 0 && styles.emptyList,
            ]}
            data={lists}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                onMenuPress={(list) => setActiveOverlay({ kind: "menu", list })}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>リストはありません</Text>
            }
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
            setActiveOverlay({ kind: "create" });
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
        visible={activeOverlay !== null}
        transparent
        animationType="fade"
        onRequestClose={closeOverlay}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOverlay}
            accessibilityLabel="画面を閉じる"
          />
          {activeOverlay?.kind === "create" && (
            <ListForm onClose={closeOverlay} />
          )}
          {activeOverlay?.kind === "menu" && (
            <ListItemMenu
              listItem={activeOverlay.list}
              onClose={closeOverlay}
              onRename={() =>
                setActiveOverlay({ kind: "rename", list: activeOverlay.list })
              }
              onDelete={() => confirmDelete(activeOverlay.list)}
            />
          )}
          {activeOverlay?.kind === "rename" && (
            <UpdateListForm
              key={activeOverlay.list.id}
              list={activeOverlay.list}
              onClose={closeOverlay}
            />
          )}
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
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
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
