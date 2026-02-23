# セットアップ手順: GitHub → Notion 同期

`BUSINESS_OVERVIEW.md` を Notion ページに自動同期するための設定手順。

---

## 1. Notion Internal Integration を作成する

1. https://www.notion.so/profile/integrations にアクセス
2. 「新しいインテグレーション」をクリック
3. 以下を設定:
   - **名前**: `GitHub Sync`（任意）
   - **ワークスペース**: 同期先の個人ワークスペースを選択
   - **機能**:
     - コンテンツを読み取る: ON
     - コンテンツを更新する: ON
     - コンテンツを挿入する: ON
4. 「送信」で作成
5. **Internal Integration Secret** をコピーして控える（`ntn_` で始まる文字列）

## 2. 同期先の Notion ページを用意する

1. Notion で新規ページを作成（例: 「NFT シャッフル配布デモ — ビジネス概要」）
2. ページ右上の `...` メニュー → 「コネクトを追加」→ 手順1で作成した `GitHub Sync` を選択
3. 「確認」をクリック

## 3. ページ ID を取得する

Notion ページの URL からページ ID を取得する。

```
https://www.notion.so/ワークスペース名/ページタイトル-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                      この32文字がページ ID
```

URL 末尾のハイフン以降の32文字（英数字）をコピーする。

**例:** `https://www.notion.so/my-workspace/Business-Overview-abc123def456...` → ページ ID は `abc123def456...`

## 4. GitHub Secrets を設定する

1. GitHub リポジトリページ → Settings → Secrets and variables → Actions
2. 「New repository secret」で以下を追加:

| Secret 名 | 値 |
|---|---|
| `NOTION_API_KEY` | 手順1で取得した Integration Secret（`ntn_...`） |
| `NOTION_PAGE_ID` | 手順3で取得したページ ID（32文字） |

## 5. 動作確認

### 方法 A: 手動トリガー（推奨）

1. GitHub リポジトリ → Actions タブ → 「Sync Markdown to Notion」
2. 「Run workflow」→ ブランチ `main` を選択 → 「Run workflow」
3. ジョブが緑（成功）になれば完了
4. Notion ページを開き、`BUSINESS_OVERVIEW.md` の内容が反映されていることを確認

### 方法 B: ローカル実行

```bash
cd scripts
npm install

NOTION_API_KEY="ntn_xxxxx" \
NOTION_PAGE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
MARKDOWN_PATH="../BUSINESS_OVERVIEW.md" \
node sync-to-notion.mjs
```

## 運用上の注意

- **Notion ページは編集しないこと**: 同期のたびに全ブロックが置換されるため、Notion 側での手動編集・コメントは消失する
- **同期タイミング**: `BUSINESS_OVERVIEW.md` が変更された PR が `main` にマージされたときに自動実行される
- **同期失敗時**: GitHub Actions のログで原因を確認。Notion Integration の権限やページ ID の設定ミスが多い
