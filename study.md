# React Native 学習記録

クイズに正答したものだけ記録する。

- **文字は必ず `<Text>` の中に書く**(2026-09-08)
  - View に直接テキストは置けない(Web の div との違い)
- **justifyContent / alignItems の役割**(2026-09-04, 09-08 再確認)
  - justifyContent = 主軸(flexDirection の方向)、alignItems = 交差軸
  - column(デフォルト)なら横方向の中央寄せは alignItems
- **セーフエリア**(2026-09-08)
  - 時計・電池・ノッチなどシステム UI と重ならない安全領域
- **Expo Router: app/ のファイル名がそのままパスになる**(2026-09-08)
  - app/index.tsx → 「/」(index は特別扱い、Web の index.html と同じ慣習)
  - app/settings.tsx → 「/settings」、`<Link href="/settings">` で遷移
  - 起点は package.json の main: "expo-router/entry"(起動係)が app/ を読む
- **_layout.tsx はパスにならない「額縁」**(2026-09-08)
  - 同じフォルダの全画面を包む共通の枠。全画面共通の設定はここに書くと一度で効く
  - いまの額縁は Stack(画面を積み重ねる遷移。ヘッダー・戻るボタンが自動で付く)
- **JSX の `{{ }}`: 外は「ここから JS」の合図、内はオブジェクト本体**(2026-09-08)
  - 特別な構文ではなく、2つの { } がたまたま重なっただけ
- **screenOptions = 全画面共通、options = その画面だけ**(2026-09-08)
  - 両方書いたら個別(options)が勝つ。共通設定を個別で上書きできる
- **Pressable が実務の主流**(2026-09-08)
  - Button は style プロパティすら無くスタイリング不可。デザインを当てるなら Pressable
