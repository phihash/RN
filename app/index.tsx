import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getMemos, type Memo } from "../storage/memos";

const KINDS = [
  ["word", "言葉"],
  ["phrase", "言い回し"],
] as const;
const LABEL = Object.fromEntries(KINDS);

export default function Home() {
  // カプセルをタップすると、その種類だけに絞る。もう一度タップで解除
  const [filter, setFilter] = useState<Memo["kind"]>();
  const { data: memos = [], isPending, isError, refetch } = useQuery({
    queryKey: ["memos"],
    queryFn: getMemos,
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable accessibilityLabel="設定">
                <Ionicons name="settings-outline" size={24} color="#192543" />
              </Pressable>
            </Link>
          ),
        }}
      />
      {filter && (
        <Pressable style={styles.filter} onPress={() => setFilter(undefined)} accessibilityLabel="絞り込みを解除">
          <Text style={styles.filterText}>{LABEL[filter]}</Text>
          <Ionicons name="close" size={16} color="#F2E8D9" />
        </Pressable>
      )}
      <FlatList
        data={filter ? memos.filter((m) => m.kind === filter) : memos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/word", params: { id: item.id } }} asChild>
            <Pressable style={styles.memo}>
              <View style={styles.meta}>
                <Pressable hitSlop={8} onPress={() => setFilter(filter ? undefined : item.kind)}>
                  <Text style={styles.chip}>{LABEL[item.kind]}</Text>
                </Pressable>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString("ja-JP")}</Text>
              </View>
              {item.kind === "word" && <Text style={styles.word}>{item.word}</Text>}
              <Text style={item.kind === "word" ? styles.description : styles.phrase}>{item.description}</Text>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          isPending ? undefined : (
            <Text style={styles.empty} onPress={isError ? () => refetch() : undefined}>
              {isError ? "読み込めませんでした（タップで再読み込み）" : filter ? `${LABEL[filter]}はまだありません` : "まだメモはありません"}
            </Text>
          )
        }
        onRefresh={refetch}
        refreshing={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}
      />
      <Link href="/new" asChild>
        <Pressable style={styles.fab} accessibilityLabel="追加">
          <Ionicons name="add" size={32} color="#F2E8D9" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#192543",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  memo: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 4,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#192543",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F2E8D9",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    color: "#192543",
    backgroundColor: "#F2E8D9",
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 15,
    color: "#555",
  },
  phrase: {
    fontSize: 16,
    color: "#192543",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 32,
  },
});
