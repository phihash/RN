import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4a90d9",
          },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "ホーム",
            headerRight: () => (
              <>
                <Link href="/settings">
                  <Ionicons name="settings-outline" size={24} color="#fff" />
                </Link>
              </>
            ),
          }}
        />
        <Stack.Screen
          name="item-catalog"
          options={{
            title: "持ち物一覧",
            presentation: "fullScreenModal",
            headerRight: () => (
              <>
                <Pressable
                  onPress={() => {
                    router.dismiss();
                  }}
                >
                  <Text style={{ color: "#fff" }}>閉じる</Text>
                </Pressable>
              </>
            ),
          }}
        />
        <Stack.Screen name="settings" options={{ title: "設定" }} />
      </Stack>
    </QueryClientProvider>
  );
}
