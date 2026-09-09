import { StyleSheet, Text, View } from "react-native";
import { Checklist } from "../types";

const deafaultList: Checklist = {
  id: "1",
  name: "デフォルト",
  items: [
    {
      id: "1",
      name: "財布",
      checked: false,
    },
    {
      id: "2",
      name: "定期券",
      checked: false,
    },
  ],
};

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>最初の画面</Text>
      <Text>右上の⚙をタップすると設定画面へ</Text>

      {deafaultList.items.map((item) => (
        <Text key={item.id}>{item.name}</Text>
      ))}
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
