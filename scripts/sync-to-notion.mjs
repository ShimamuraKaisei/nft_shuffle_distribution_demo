import { Client } from "@notionhq/client";
import { markdownToBlocks } from "@tryfabric/martian";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// --- 設定 ---
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;
const MARKDOWN_PATH = process.env.MARKDOWN_PATH || "BUSINESS_OVERVIEW.md";
const MAX_RETRIES = 3;
const CHUNK_SIZE = 100; // Notion API の1リクエストあたりのブロック上限

// --- バリデーション ---
if (!NOTION_API_KEY) {
  console.error("ERROR: NOTION_API_KEY が設定されていません");
  process.exit(1);
}
if (!NOTION_PAGE_ID) {
  console.error("ERROR: NOTION_PAGE_ID が設定されていません");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

// --- リトライ付き API 呼び出し ---
async function callWithRetry(fn, context = "") {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && attempt < MAX_RETRIES) {
        const retryAfter = error.headers?.["retry-after"]
          ? parseInt(error.headers["retry-after"], 10) * 1000
          : attempt * 1000;
        console.warn(
          `Rate limit (429) ${context}: ${retryAfter}ms 後にリトライ (${attempt}/${MAX_RETRIES})`
        );
        await sleep(retryAfter);
        continue;
      }
      throw error;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- 既存ブロック全削除 ---
async function deleteAllChildBlocks(pageId) {
  let deletedCount = 0;
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await callWithRetry(
      () =>
        notion.blocks.children.list({
          block_id: pageId,
          start_cursor: startCursor,
          page_size: 100,
        }),
      "ブロック一覧取得"
    );

    for (const block of response.results) {
      await callWithRetry(
        () => notion.blocks.delete({ block_id: block.id }),
        `ブロック削除 ${block.id}`
      );
      deletedCount++;
    }

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  return deletedCount;
}

// --- 新規ブロック追加（チャンク分割） ---
async function appendBlocks(pageId, blocks) {
  let appendedCount = 0;

  for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
    const chunk = blocks.slice(i, i + CHUNK_SIZE);
    await callWithRetry(
      () =>
        notion.blocks.children.append({
          block_id: pageId,
          children: chunk,
        }),
      `ブロック追加 (${i + 1}〜${i + chunk.length})`
    );
    appendedCount += chunk.length;
  }

  return appendedCount;
}

// --- メイン処理 ---
async function main() {
  console.log(`=== GitHub → Notion 同期開始 ===`);
  console.log(`対象ファイル: ${MARKDOWN_PATH}`);

  // 1. Markdown 読み込み
  const filePath = resolve(process.cwd(), MARKDOWN_PATH);
  let markdown;
  try {
    markdown = readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`ERROR: ファイル読み込み失敗: ${filePath}`);
    console.error(error.message);
    process.exit(1);
  }
  console.log(`Markdown 読み込み完了 (${markdown.length} 文字)`);

  // 2. Notion ブロックへ変換
  const blocks = markdownToBlocks(markdown);
  console.log(`Notion ブロックへ変換完了 (${blocks.length} ブロック)`);

  // 3. 既存ブロック全削除
  console.log(`既存ブロック削除中...`);
  const deletedCount = await deleteAllChildBlocks(NOTION_PAGE_ID);
  console.log(`既存ブロック削除完了 (${deletedCount} ブロック)`);

  // 4. 新規ブロック追加
  console.log(`新規ブロック追加中...`);
  const appendedCount = await appendBlocks(NOTION_PAGE_ID, blocks);
  console.log(`新規ブロック追加完了 (${appendedCount} ブロック)`);

  console.log(`=== 同期完了 ===`);
  console.log(
    `サマリー: 削除=${deletedCount}, 追加=${appendedCount}, ファイル=${MARKDOWN_PATH}`
  );
}

main().catch((error) => {
  console.error(`ERROR: 同期処理に失敗しました`);
  console.error(error);
  process.exit(1);
});
