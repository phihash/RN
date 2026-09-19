import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function RootLayout() {
  const router = useRouter();
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
            <>
              <Link href="/settings">
                <Ionicons name="settings-outline" size={24} color="#4a90d9" />
              </Link>
            </>
          ),
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          title: "メニュー",
          presentation: "fullScreenModal",
          headerRight: () => (
            <>
              <Pressable
                onPress={() => {
                  router.dismiss();
                }}
              >
                <Text>閉じる</Text>
              </Pressable>
            </>
          ),
        }}
      />
      <Stack.Screen name="settings" options={{ title: "設定" }} />
    </Stack>
  );
}
