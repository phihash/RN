import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link, router } from "expo-router";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { track } from "../storage/analytics";
import { signInWithApple } from "../storage/auth";
import { uploadLocalMemos } from "../storage/memos";

export default function SignIn() {
  const queryClient = useQueryClient();
  const signIn = useMutation({
    mutationFn: async () => {
      await signInWithApple();
      await uploadLocalMemos();
    },
    onSuccess: () => {
      track("sign_in");
      router.back();
    },
    // 移行に失敗してもサインインは済んでいる。残ったメモは端末に残る
    onSettled: () => queryClient.invalidateQueries(),
    onError: (e: any) => {
      if (e?.code !== "ERR_REQUEST_CANCELED") Alert.alert("サインインできませんでした", e.message);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Image source={require("../assets/splash-icon.png")} style={styles.logo} />
        <Text style={styles.title}>コトノハメモ</Text>
        <Text style={styles.lead}>サインインすると、メモをバックアップして{"\n"}機種変更しても引き継げます</Text>
      </View>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={8}
        style={styles.appleButton}
        onPress={() => signIn.mutate()}
      />
      <Text style={styles.agree}>
        サインインすると、
        <Link href={{ pathname: "/legal", params: { doc: "terms" } }} style={styles.link}>利用規約</Link>
        と
        <Link href={{ pathname: "/legal", params: { doc: "privacy" } }} style={styles.link}>プライバシーポリシー</Link>
        に同意したものとみなします。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
    backgroundColor: "#192543",
  },
  brand: {
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 160,
    height: 160,
  },
  title: {
    color: "#F2E8D9",
    fontSize: 28,
    fontWeight: "bold",
  },
  lead: {
    color: "#F2E8D9",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  agree: {
    color: "#F2E8D9",
    fontSize: 12,
    textAlign: "center",
    marginHorizontal: 32,
    marginTop: -32,
  },
  link: {
    textDecorationLine: "underline",
  },
  appleButton: {
    width: 260,
    height: 48,
  },
});
