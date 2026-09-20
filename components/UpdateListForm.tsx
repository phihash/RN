import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";

import { useState } from "react";
import { updateListName, type SavedList } from "../storage/list";
import { useQueryClient } from "@tanstack/react-query";

type UpdateListFormProps = {
  list: SavedList;
  onClose: () => void;
};

export default function UpdateListForm({ list, onClose }: UpdateListFormProps) {
  const [listName, setListName] = useState(list.name);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const canSubmit = listName.trim().length > 0 && !isSaving;
  const queryClient = useQueryClient();

  const save = async () => {
    if (!canSubmit) return;
    setIsSaving(true);
    setError("");
    try {
      const updated = await updateListName(list.id, listName);
      if (!updated) {
        setError("リストが見つかりません。もう一度お試しください。");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      onClose();
    } catch (cause) {
      console.error("リスト名の変更に失敗しました", cause);
      setError("変更できませんでした。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="閉じる"
        >
          <Text style={styles.closeText}>閉じる</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>リスト名を変更</Text>
      <Text style={styles.label}>リスト名</Text>
      <TextInput
        style={styles.input}
        value={listName}
        onChangeText={(name) => {
          setListName(name);
          setError("");
        }}
        placeholder="変更するリスト名を入力してください"
        placeholderTextColor="#91a3ad"
        returnKeyType="done"
        onSubmitEditing={save}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.button,
          !canSubmit && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={save}
      >
        <Text style={styles.buttonText}>{isSaving ? "変更中..." : "リスト名を変更する"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#263f4d",
    marginBottom: 4,
  },
  closeText: {
    fontSize: 14,
    color: "#5a7684",
    padding: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5a7684",
  },
  input: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: "#dbe4ea",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#263f4d",
    backgroundColor: "#fff",
  },
  button: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#4a90d9",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#aebcc6",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#c54b4b",
    fontSize: 14,
  },
});
