import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { createList } from "../storage/list";
import { useQueryClient } from "@tanstack/react-query";

type ListFormProps = {
  onClose: () => void;
};

export default function ListForm({ onClose }: ListFormProps) {
  const router = useRouter();
  const [listName, setListName] = useState<string>("");
  const canSubmit = listName.trim().length > 0;
  const queryClient = useQueryClient();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>新しいリスト</Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="閉じる"
        >
          <Text style={styles.closeText}>閉じる</Text>
        </Pressable>
      </View>
      <Text style={styles.label}>リスト名</Text>
      <TextInput
        style={styles.input}
        value={listName}
        onChangeText={setListName}
        placeholder="リスト名を入力してください"
        placeholderTextColor="#91a3ad"
        returnKeyType="done"
      />
      <Pressable
        accessibilityRole="button"
        disabled={!canSubmit}
        style={({ pressed }) => [
          styles.button,
          !canSubmit && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={async () => {
          if (canSubmit) {
            const listId = await createList(listName);

            router.push({
              pathname: "/item-catalog",
              params: {
                listId: String(listId),
              },
            });
            onClose();
            await queryClient.invalidateQueries({ queryKey: ["lists"] });
          }
        }}
      >
        <Text style={styles.buttonText}>リストを作成</Text>
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
});
