import { StyleSheet, Text, View } from "react-native";
import ItemCard from "../components/ItemCard";

export default function Menu() {
  return (
    <View style={styles.container}>
      <ItemCard />
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
