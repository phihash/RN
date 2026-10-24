import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../storage/analytics";
import { getUser } from "../storage/auth";

const queryClient = new QueryClient();

function RootStack() {
  const { data: user, isPending } = useQuery({ queryKey: ["user"], queryFn: getUser });
  if (isPending) return null;

  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" options={{ title: "コトノハメモ" }} />
      <Stack.Screen name="settings" options={{ title: "設定" }} />
      <Stack.Screen
        name="word"
        options={{
          headerShown: false,
          presentation: "formSheet",
          sheetAllowedDetents: "fitToContents",
          sheetGrabberVisible: true,
        }}
      />
      {/* サインインは任意（審査 5.1.1(v)）。サインイン済みなら開けない */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" options={{ headerShown: false, presentation: "modal" }} />
      </Stack.Protected>
      <Stack.Screen name="legal" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootStack />
    </QueryClientProvider>
  );
}
