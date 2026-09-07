# React Native 学習記録

クイズに正答したものだけ記録する。

- **文字は必ず `<Text>` の中に書く**(2026-09-08)
  - View に直接テキストは置けない(Web の div との違い)
- **justifyContent / alignItems の役割**(2026-09-04, 09-08 再確認)
  - justifyContent = 主軸(flexDirection の方向)、alignItems = 交差軸
  - column(デフォルト)なら横方向の中央寄せは alignItems
- **セーフエリア**(2026-09-08)
  - 時計・電池・ノッチなどシステム UI と重ならない安全領域
