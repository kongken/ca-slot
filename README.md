# 凤凰知音冬季里程助手

React + Vite 的 Cloudflare Pages web app，采用 shadcn 风格的本地 UI primitives（`Badge`、`Button`、`Card`、`Select`、`Tabs`），用于查询凤凰知音 2026 冬季淡旺季里程折扣。

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

Cloudflare Pages 配置：构建命令使用 `npm run build`，输出目录使用 `dist`。

## Excel 数据处理

用户提供的文件名已记录在 `src/data/seasonal-rules.js`，导入脚本位于 `scripts/import-excel.mjs`：

```bash
npm run inspect:excel -- data/source.xlsx
npm run import:excel -- data/source.xlsx
```

`inspect:excel` 用于先分析工作簿，不生成应用数据：它会输出工作表名称、数据行数、列数、字段名和前两条样例。`import:excel` 使用 `xlsx` 读取所有工作表，保留工作表名和源行号，并将常见中文字段映射为 `airlineCode`、`airlineName`、`origin`、`destination`、`cabin`、`season`、`mileage`，同时保留每行 `raw` 原始字段，写入 `src/data/imported-seasonal-rules.json`；页面会在下一次构建时自动读取该文件。推荐的在线查询维度是航司、季节、出发地、目的地、舱位，结果展示折扣里程和来源行。

当前下载地址返回 HTTP 403，工作区和远端均未找到该 Excel 或等价导出数据；页面会显示清晰的数据状态和来源说明。要完成真实数据接入，请用户直接上传 Excel 文件，或提供无需鉴权、可下载的文件 URL。

## 数据来源

- 官方入口：国航、深航、山航、昆航的凤凰知音运输奖励明细页
- Excel 来源：`国航系2026冬季淡旺季里程折扣统计.xlsx`
- 页面查询维度：航司、季节、出发地、目的地、舱位；结果字段：折扣里程、来源工作表、源行号
- 页面展示的规则应以官方页面和成功导入、核验后的 Excel 数据为准
