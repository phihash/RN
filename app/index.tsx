import { StyleSheet, Text, View, Button } from "react-native";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState<number>(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>最初の画面</Text>
      <Text>右上の⚙をタップすると設定画面へ</Text>
      <Text>押した回数{count}</Text>
      <Button
        title="ボタン"
        onPress={() => {
          setCount(count + 1);
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
