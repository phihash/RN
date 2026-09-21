import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { SavedList } from "../storage/list";

type ListItemProps = {
  item: SavedList;
  onMenuPress: (item: SavedList) => void;
};

export default function ListItem({ item, onMenuPress }: ListItemProps) {
  const router = useRouter();

  return (
    <View style={styles.listCard}>
      <Pressable
        style={({ pressed }) => [
          styles.listLink,
          pressed && styles.listLinkPressed,
        ]}
        onPress={() =>
          router.push({
            pathname: "/items/[listId]",
            params: { listId: String(item.id) },
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`${item.name}を開く`}
      >
        <Text style={styles.listName} numberOfLines={2}>
          {item.name}
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.menuButton,
          pressed && styles.menuButtonPressed,
        ]}
        onPress={() => onMenuPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}のメニューを開く`}
      >
        <Ionicons name="ellipsis-horizontal" size={22} color="#4a90d9" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#dbe4ea",
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  listLink: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    paddingLeft: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  listLinkPressed: {
    backgroundColor: "#f4f8fb",
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#eaf4fc",
    marginHorizontal: 16,
  },
  menuButtonPressed: {
    opacity: 0.7,
  },
  listName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#263f4d",
  },
});
