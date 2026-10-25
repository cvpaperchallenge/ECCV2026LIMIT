# コンテナ再ビルド時のセキュリティ確認（2026-10-25）

今回の目的は、ローカルで適用したBrotli修正が再ビルドで失われないようにすること。
ホスト設定、認証情報、既存コンテナ、依存ロックは変更しない。既存タグ・成果物は
バックアップとして保持し、新しいタグで構築・検証してから利用先を切り替える。
この変更だけで既存コンテナや配布済みイメージが更新されるわけではない。

根拠は[Node.js公式告知](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)と
[Debian公式追跡情報](https://security-tracker.debian.org/tracker/CVE-2026-111497)。
Debianは修正をバックポートするため、Brotliの上流バージョン番号だけでは判断しない。
以下は2026-10-25時点の基準であり、将来の全脆弱性への安全性を保証しない。

Dockerfileと開発・CI用ComposeのNodeを22.23.4 bookwormの同一公式digestへ固定した。
旧bullseyeからbookwormへの変更を含む。Nodeのメジャーとyarn.lockは維持する。
ComposeのBASE_IMAGE指定も変更し、Dockerfileだけの更新が上書きされる経路を解消した。

```sh
sh environments/check-container-security.sh IMAGE
```

IMAGEはこのDockerfileから新しいタグで構築したイメージ名に置き換える。
Nodeの修正版判定、Brotli往復処理、修正に対応するエラー定数をネットワークなしで確認する。

ローカル検証: linux/arm64で依存インストールを含むビルド成功。
既存ソースを隔離コンテナに入れ、`yarn lint` → `yarn build` → `yarn test` の順に実行し46件成功。
最初にtestをbuildより先に実行した際はHTML生成物依存のテストが失敗した。
CIと同じ順序に直して成功したもので、テストの条件は変更していない。


検査は先に作成し、修正前イメージでは未修正Node/システムBrotliまたは旧Playwright起動経路を
理由に失敗（RED）、修正後のイメージでは成功（GREEN）した。
ShellCheckも実施。GitHub CIの成功やデプロイの成功を意味するものではない。
Python wheel等に独自に内包されたライブラリまですべて修正したという主張ではない。

再ビルドしたNodeでnodejs.orgへの正常TLS接続と、既知の問題証明書を提示する
検査専用ホスト2経路の拒否を確認した。案内ページ自体の接続可否とは区別する。
