import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function ListForm() {
  const router = useRouter();
  const [listName, setListName] = useState<string>("");
  const canSubmit = listName.trim().length > 0;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>新しいリスト</Text>
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
        onPress={() => {
          if (canSubmit) {
            router.push("/menu");
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
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#263f4d",
    marginBottom: 4,
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
