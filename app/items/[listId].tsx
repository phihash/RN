import { StyleSheet, Text, View } from "react-native";

export default function Items() {
  return (
    <View style={styles.container}>
      <Text>アイテムはありません</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
