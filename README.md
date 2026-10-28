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
npm run import:excel -- data/source.xlsx
```

脚本使用 `xlsx` 读取所有工作表，保留工作表名和源行号，并输出 JSON，方便后续把字段映射成页面查询记录。当前下载地址返回 HTTP 403，工作区没有写入未经验证的里程数字；页面会显示清晰的数据状态和来源说明。

## 数据来源

- 官方入口：国航、深航、山航、昆航的凤凰知音运输奖励明细页
- Excel 来源：`国航系2026冬季淡旺季里程折扣统计.xlsx`
- 页面展示的规则应以官方页面和成功导入、核验后的 Excel 数据为准
