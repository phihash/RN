import { StyleSheet, Text, View } from "react-native";

const ITEMS = ["財布", "定期", "スマホ", "家の鍵", "社員証"];

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>最初の画面</Text>
      <Text>右上の⚙をタップすると設定画面へ</Text>

      {/* TODO: 削除機能を付けるとき items を {id, text} のオブジェクト配列にして
          key を index → 固有ID に変える(index key は削除で対応付けがズレるため) */}
      {ITEMS.map((item, index) => (
        <Text key={index}>{item}</Text>
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
