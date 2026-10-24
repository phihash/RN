import { router } from "expo-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Animated, KeyboardAvoidingView, PanResponder, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 画面の下端にぴったり付くボトムシート。iOS 標準のシートは浮いて隙間ができるので自前で作る。
// ルートは presentation: "transparentModal", animation: "none" で開く
const HIDDEN = 800;

export function useSheet() {
  const y = useRef(new Animated.Value(HIDDEN)).current;
  const open = () => Animated.spring(y, { toValue: 0, bounciness: 0, useNativeDriver: true }).start();
  // 閉じたあとの遷移を差し替えられる（メニューから入力画面へ移るときなど）
  const close = (then = () => router.back()) =>
    Animated.timing(y, { toValue: HIDDEN, duration: 200, useNativeDriver: true }).start(() => then());
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4,
      onPanResponderMove: (_, g) => y.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => (g.dy > 100 || g.vy > 1 ? close() : open()),
    }),
  ).current;
  useEffect(open, []);
  return { y, close, pan };
}

export function Sheet({ sheet, children }: { sheet: ReturnType<typeof useSheet>; children: ReactNode }) {
  const { bottom } = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.root}>
      <Animated.View
        style={[styles.backdrop, { opacity: sheet.y.interpolate({ inputRange: [0, HIDDEN], outputRange: [1, 0] }) }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => sheet.close()} accessibilityLabel="閉じる" />
      </Animated.View>
      <Animated.View style={[styles.sheet, { paddingBottom: bottom, transform: [{ translateY: sheet.y }] }]}>
        {/* つまみを下にスワイプして閉じる */}
        <View {...sheet.pan.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
        </View>
        {children}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#fff",
  },
  handleArea: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
  },
});
