import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type ScrollViewInstance } from "react-native";
import { getMemos, type Memo } from "../storage/memos";

const TABS = [
  ["word", "言葉"],
  ["phrase", "言い回し"],
] as const;

export default function Home() {
  const [kind, setKind] = useState<Memo["kind"]>("word");
  const { width } = useWindowDimensions();
  const pager = useRef<ScrollViewInstance>(null);
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
      <View style={styles.tabs}>
        {TABS.map(([value, label], i) => (
          <Pressable
            key={value}
            style={styles.tab}
            onPress={() => {
              setKind(value);
              pager.current?.scrollTo({ x: i * width });
            }}
          >
            <Text style={[styles.tabText, kind === value && styles.tabTextActive]}>{label}</Text>
            {kind === value && <View style={styles.tabBar} />}
          </Pressable>
        ))}
      </View>
      {/* 横スワイプでタブ切り替え（RN 標準の paging だけで実現） */}
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setKind(TABS[Math.round(e.nativeEvent.contentOffset.x / width)][0])}
      >
        {TABS.map(([value, label]) => (
          <FlatList
            key={value}
            style={{ width }}
            data={memos.filter((m) => m.kind === value)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link href={{ pathname: "/word", params: { id: item.id } }} asChild>
                <Pressable style={styles.memo}>
                  {item.kind === "word" && <Text style={styles.word}>{item.word}</Text>}
                  <Text style={item.kind === "word" ? styles.description : styles.phrase}>{item.description}</Text>
                </Pressable>
              </Link>
            )}
            ListEmptyComponent={
              isPending ? undefined : (
                <Text style={styles.empty} onPress={isError ? () => refetch() : undefined}>
                  {isError ? "読み込めませんでした（タップで再読み込み）" : `まだ${label}はありません`}
                </Text>
              )
            }
            onRefresh={refetch}
            refreshing={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}
          />
        ))}
      </ScrollView>
      <Link href={{ pathname: "/word", params: { kind } }} asChild>
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
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  tabTextActive: {
    color: "#192543",
    fontWeight: "bold",
  },
  tabBar: {
    position: "absolute",
    bottom: -1,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#192543",
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
