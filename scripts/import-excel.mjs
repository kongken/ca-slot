import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const input = process.argv[2] || 'data/source.xlsx';
const output = process.argv[3] || 'src/data/imported-seasonal-rules.json';
const airlineCodes = { 国航: 'CA', 深航: 'ZH', 山航: 'SC', 昆航: 'KY', 西藏航: 'TV', 澳门航: 'NX' };
const fields = {
  airlineName: ['航司', '航空公司', '航空公司名称', 'airlinename'],
  origin: ['出发城市', '出发地', '始发地', 'origin'],
  destination: ['到达城市', '目的地', '到达地', 'destination'],
  tripType: ['行程', '行程类型', 'triptype'],
  cabin: ['舱位', '舱等', '客舱', 'cabin'],
  period: ['时间段', '日期范围', '有效期', 'period'],
  discount: ['折扣', '折扣系数', '里程折扣', 'discount'],
};
const required = ['airlineName', 'origin', 'destination', 'tripType', 'cabin', 'period', 'discount'];

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
function readField(record, candidates) {
  const entry = Object.entries(record).find(([key]) => candidates.includes(clean(key).toLowerCase()));
  return entry ? entry[1] : '';
}
function numberValue(value) {
  const normalized = clean(value).replace(/,/g, '');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
function normalizeRow(record, sheet, sourceRow) {
  const raw = Object.fromEntries(Object.entries(record).map(([key, value]) => [clean(key), value]));
  const row = {
    id: `${sheet}-${sourceRow}`,
    sheet,
    sourceRow,
    market: sheet === '国内' ? 'domestic' : sheet === '国际' ? 'international' : 'unknown',
    season: 'winter',
    airlineCode: '',
    airlineName: clean(readField(raw, fields.airlineName)),
    origin: clean(readField(raw, fields.origin)),
    destination: clean(readField(raw, fields.destination)),
    tripType: clean(readField(raw, fields.tripType)),
    cabin: clean(readField(raw, fields.cabin)),
    period: clean(readField(raw, fields.period)),
    discount: numberValue(readField(raw, fields.discount)),
    raw,
  };
  row.airlineCode = airlineCodes[row.airlineName] || '';
  const errors = required.flatMap((field) => {
    if (field === 'discount') return row.discount === null ? [`${field}: 必须是数字`] : [];
    return row[field] ? [] : [`${field}: 必填`];
  });
  return { row, errors };
}

if (!fs.existsSync(input)) {
  console.error(`Source workbook not found: ${input}`);
  process.exit(1);
}

const workbook = XLSX.readFile(input, { cellDates: true });
const sheets = [];
const rows = [];
const invalidRows = [];
for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name];
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const headers = (matrix[0] || []).map(clean).filter(Boolean);
  const records = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  sheets.push({ name, headers, rowCount: records.length, columnCount: headers.length });
  records.forEach((record, index) => {
    const sourceRow = index + 2;
    const { row, errors } = normalizeRow(record, name, sourceRow);
    if (errors.length) invalidRows.push({ sheet: name, sourceRow, errors, raw: row.raw });
    else {
      const { raw: _raw, ...normalized } = row;
      rows.push(normalized);
    }
  });
}
const dimensions = ['airlineCode', 'airlineName', 'market', 'season', 'origin', 'destination', 'tripType', 'cabin', 'period', 'discount'];
const summary = {
  totalRows: rows.length + invalidRows.length,
  validRows: rows.length,
  invalidRows: invalidRows.length,
  markets: [...new Set(rows.map((row) => row.market))],
  airlines: [...new Set(rows.map((row) => row.airlineName))],
  seasons: [...new Set(rows.map((row) => row.season))],
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ source: path.basename(input), importedAt: new Date().toISOString(), dimensions, summary, sheets, invalidRows, rows }, null, 2));
console.log(`Imported ${rows.length} valid rows from ${sheets.length} sheet(s); ${invalidRows.length} invalid row(s) written to ${output}`);
console.log(`Query dimensions: ${dimensions.join(', ')}`);
if (invalidRows.length) process.exitCode = 2;
