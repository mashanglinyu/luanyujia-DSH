// 扫所有条目 → 生成 index.json（站点直接读这个）
// 用法：node tools/build-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATS = ['启动动画', '界面与主题', '插件', '技能', 'MCP', '场景', '其他'];

const items = [];
const warnings = [];

for (const cat of CATS) {
  const dir = path.join(ROOT, cat);
  if (!fs.existsSync(dir)) { warnings.push('缺分类目录：' + cat); continue; }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const itemDir = path.join(dir, ent.name);
    const mf = path.join(itemDir, 'manifest.json');
    if (!fs.existsSync(mf)) { warnings.push('跳过（无 manifest.json）：' + cat + '/' + ent.name); continue; }

    let m;
    try { m = JSON.parse(fs.readFileSync(mf, 'utf8')); }
    catch (e) { warnings.push('JSON 坏了：' + cat + '/' + ent.name + ' → ' + e.message); continue; }

    // 条目总大小
    let bytes = 0;
    const walk = (d) => {
      for (const x of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, x.name);
        if (x.isDirectory()) walk(p); else bytes += fs.statSync(p).size;
      }
    };
    walk(itemDir);

    items.push({
      id: m.id || ent.name,
      title: m.title || ent.name,
      category: m.category || cat,
      version: m.version || '',
      summary: m.summary || '',
      author: m.author || '',
      license: m.license || '',
      compat: m.compat || null,
      meta: m.meta || null,
      install: m.install || '',
      preview: m.preview || null,
      updatedAt: m.updatedAt || '',
      path: cat + '/' + ent.name,
      bytes
    });
  }
}

items.sort((a, b) => a.category.localeCompare(b.category, 'zh') || a.id.localeCompare(b.id));

const out = {
  repo: 'luanyujia-DSH',
  generatedAt: new Date().toISOString().slice(0, 10),
  count: items.length,
  items
};
fs.writeFileSync(path.join(ROOT, 'index.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');

console.log('✓ index.json 已生成：' + items.length + ' 个条目');
for (const it of items) console.log('  · [' + it.category + '] ' + it.id + '  ' + Math.round(it.bytes / 1024) + ' KB');
if (warnings.length) {
  console.log('\n⚠ 提醒 ' + warnings.length + ' 条：');
  warnings.forEach((w) => console.log('  · ' + w));
}
