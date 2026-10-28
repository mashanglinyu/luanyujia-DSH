# 场景

**收什么**：工作台布局配置：`scenarios/*.json` + 定位卡

**不收什么**：直接抄别人场景但不写明改哪的

**注意**：面板 id / 坐标 / 会话绑定要能对上

## 命名规则（2026-10-28 定）

- 目录名 = `layout-<主面板>-<变体>`，全小写、连字符：`layout-preview-ai`、`layout-dev-quad`、`layout-disk-checkup`
- 中文标题写在 `manifest.json` 的 `title`，README 里用同一套称呼
- `manifest.json` 的 `id` 与目录名一致；`src/<目录名>.json` 的场景 `id` 用下划线版（`layout_dev_quad`）
- 排序按 `layout-` 前缀 + 首字母，天然成组

## 一个条目的结构

```
场景/<slug>/
├─ manifest.json      id/title/category=场景/version/summary/author/license/compat/install/preview/updatedAt/meta
├─ README.md          布局表（位置·面板·类型）+ 怎么装 + 改哪 + 注意
├─ preview.mp4（或 gif）  5 秒 1280×720 无声，只录「点开→切布局→面板出现」
├─ poster.jpg         1280×720、≤300KB（卡片封面，集市直接引用）
└─ src/<slug>.json    场景配置：id/name/description/layout=grid/theme=dark/[cols]/panels[]
```

## meta 字段（集市展示用）

```json
"meta": {
  "scenes": [{ "file": "src/layout-dev-quad.json", "panels": 4, "renderers": ["view","file","reserved","harness"] }],
  "requires": ["renderer:view", "renderer:file", "renderer:reserved", "renderer:harness"],
  "changes": ["面板 id 别改", "AI 面板要自己选会话", "复制到 外壳\\scenarios\\ 后刷新", ""]
}
```

## 硬规则

- `sessionId` / `sessionTitle` / `pinTarget` **一律剔除**（那是作者本机的会话）；AI 面板靠用户自己选。
- 只收**通用渲染器**的布局（`view` / `file` / `harness` / `embed` / `flow` / `reserved` / `wb-cards` / `pc-*`）；依赖私有库的（OA / 行情 / 个人站 / 复盘私人层 / 客户定制）**不收**。
- 网格默认 4 列；`col + w - 1 > 4` 必须在顶层写 `"cols": 5`。面板不能重叠，同一行高度要一致。
- 加完跑 `node tools/validate-item.mjs`，再 `node tools/build-index.mjs` 更新总索引。
