import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "ホーム",
          headerRight: () => (
            <Link href="/settings">
              <Ionicons name="settings-outline" size={24} color="#4a90d9" />
            </Link>
          ),
        }}
      />
      <Stack.Screen name="settings" options={{ title: "設定" }} />
    </Stack>
  );
}
