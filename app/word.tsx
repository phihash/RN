import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { track } from "../storage/analytics";
import { addMemo, deleteMemo, updateMemo, type Memo } from "../storage/memos";

// 全画面の入力画面。id があれば編集、なければ kind で新規
export default function WordScreen() {
  const params = useLocalSearchParams<{ id?: string; kind?: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const memo = queryClient.getQueryData<Memo[]>(["memos"])?.find((m) => m.id === params.id);
  const kind = memo?.kind ?? (params.kind === "phrase" ? "phrase" : "word");
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

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.container, { paddingTop: top + 8, paddingBottom: bottom }]}>
      <View style={styles.header}>
        <Pressable style={styles.close} onPress={() => router.back()} accessibilityLabel="閉じる">
          <Ionicons name="close" size={26} color="#333" />
        </Pressable>
        <Text style={styles.title}>{memo ? "編集する" : isWord ? "言葉を書く" : "言い回しを書く"}</Text>
        <Pressable
          style={[styles.save, !canSave && styles.saveDisabled]}
          onPress={onSave}
          disabled={!canSave || save.isPending}
        >
          <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>保存</Text>
        </Pressable>
      </View>
      {isWord && (
        <TextInput
          style={styles.word}
          value={word}
          onChangeText={setWord}
          placeholder="言葉"
          placeholderTextColor="#aaa"
          autoFocus={!memo}
        />
      )}
      <TextInput
        style={styles.body}
        value={description}
        onChangeText={setDescription}
        placeholder={isWord ? "どういう意味？" : "共感した言い回しや考え"}
        placeholderTextColor="#aaa"
        autoFocus={!memo && !isWord}
        multiline
      />
      {memo && (
        <Pressable style={styles.delete} onPress={confirmDelete} disabled={remove.isPending}>
          <Text style={styles.deleteText}>削除</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#192543",
  },
  save: {
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    backgroundColor: "#192543",
  },
  saveDisabled: {
    backgroundColor: "#f0f0f0",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F2E8D9",
  },
  saveTextDisabled: {
    color: "#bbb",
  },
  word: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#192543",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  body: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    paddingTop: 12,
    textAlignVertical: "top",
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
