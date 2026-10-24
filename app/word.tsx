import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { track } from "../storage/analytics";
import { addMemo, deleteMemo, updateMemo, type Memo } from "../storage/memos";

const KINDS = [
  ["word", "言葉を書く", "book-outline"],
  ["phrase", "言い回しを書く", "chatbubble-ellipses-outline"],
] as const;

// id があれば編集。新規はまず種類を選んでから、同じシートでフォームを出す
export default function WordSheet() {
  const params = useLocalSearchParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const memo = queryClient.getQueryData<Memo[]>(["memos"])?.find((m) => m.id === params.id);
  const [picked, setPicked] = useState<Memo["kind"]>();
  const kind = memo?.kind ?? picked ?? "word";
  const isWord = kind === "word";
  const [word, setWord] = useState(memo?.word ?? "");
  const [description, setDescription] = useState(memo?.description ?? "");
  const canSave = (!isWord || !!word.trim()) && !!description.trim();
  const onError = (e: Error) => Alert.alert("エラー", e.message);
  const done = () => {
    queryClient.invalidateQueries({ queryKey: ["memos"] });
    router.back();
  };
  const save = useMutation({
    mutationFn: async (input: Pick<Memo, "kind" | "word" | "description">) => {
      await (memo ? updateMemo({ id: memo.id, ...input }) : addMemo(input));
    },
    onSuccess: () => {
      track(`${kind}_${memo ? "updated" : "created"}`);
      done();
    },
    onError,
  });
  const remove = useMutation({
    mutationFn: deleteMemo,
    onSuccess: () => {
      track(`${kind}_deleted`);
      done();
    },
    onError,
  });

  const onSave = () => {
    if (canSave) save.mutate({ kind, word: isWord ? word.trim() : "", description: description.trim() });
  };
  const confirmDelete = () =>
    Alert.alert(isWord ? "この言葉を削除しますか？" : "このメモを削除しますか？", "元に戻すことはできません。", [
      { text: "キャンセル", style: "cancel" },
      { text: "削除する", style: "destructive", onPress: () => memo && remove.mutate(memo.id) },
    ]);

  if (!memo && !picked) {
    return (
      <View style={styles.menu}>
        {KINDS.map(([value, label, icon]) => (
          <Pressable key={value} style={styles.menuRow} onPress={() => setPicked(value)}>
            <Ionicons name={icon} size={26} color="#192543" />
            <Text style={styles.menuText}>{label}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isWord && (
        <TextInput
          style={[styles.input, styles.word]}
          value={word}
          onChangeText={setWord}
          placeholder="言葉"
          autoFocus={!memo}
        />
      )}
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder={isWord ? "説明" : "共感した言い回しや考え"}
        autoFocus={!memo && !isWord}
        multiline
      />
      <Pressable
        style={[styles.button, !canSave && styles.buttonDisabled]}
        onPress={onSave}
        disabled={!canSave || save.isPending}
      >
        <Text style={styles.buttonText}>保存</Text>
      </Pressable>
      {memo && (
        <Pressable style={styles.delete} onPress={confirmDelete} disabled={remove.isPending}>
          <Text style={styles.deleteText}>削除</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#192543",
  },
  container: {
    padding: 16,
    paddingTop: 24,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  word: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#192543",
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  button: {
    height: 56,
    marginTop: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#192543",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#F2E8D9",
    fontSize: 17,
    fontWeight: "bold",
  },
  delete: {
    alignItems: "center",
    paddingVertical: 12,
  },
  deleteText: {
    color: "#C0392B",
    fontSize: 16,
  },
});
