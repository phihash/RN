import { StyleSheet, Text, View } from "react-native";

export default function Menu() {
  return (
    <View style={styles.container}>
      <Text>メニュー</Text>
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
