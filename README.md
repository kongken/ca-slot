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

用户上传的文件已放在本地导入目录，导入脚本位于 `scripts/import-excel.mjs`：

```bash
npm run inspect:excel -- data/source.xlsx
npm run import:excel -- data/source.xlsx
```

`inspect:excel` 用于先分析工作簿，不生成应用数据：它会输出工作表名称、数据行数、列数、字段名和前两条样例。`import:excel` 使用 `xlsx` 读取全部工作表，保留工作表名和源行号，并将原始字段映射为 `airlineCode`、`airlineName`、`market`、`season`、`origin`、`destination`、`tripType`、`cabin`、`period`、`discount`，同时保留无效行的 `raw` 原始字段，写入 `src/data/imported-seasonal-rules.json`；页面会在下一次构建时自动读取该文件。导入器会拒绝缺失必填字段或非数字折扣，并把错误行写入 `invalidRows`。

当前附件已成功导入：`国内`（3,598 行）和 `国际`（981 行）两个工作表，共 4,579 条有效记录、0 条无效记录。推荐的在线查询维度是航司、航区、出发地、目的地、行程、舱位和时间段，结果展示原始折扣并保留来源工作表和源行号。

## 数据来源

- 官方入口：国航、深航、山航、昆航的凤凰知音运输奖励明细页
- Excel 来源：用户上传附件 `国航系2026冬季淡旺季里程折扣统计.xlsx`
- 实际字段：航司、出发城市、到达城市、行程、舱位、时间段、折扣
- 页面查询维度：航司、航区、出发地、目的地、行程、舱位、时间段；结果字段：折扣、来源工作表、源行号；航线统计按当前筛选结果汇总不同航线数量、记录数量和前 6 条高频航线
- 页面展示的规则应以官方页面和成功导入、核验后的 Excel 数据为准
