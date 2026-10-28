import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const input = process.argv[2] || 'data/source.xlsx';
const output = process.argv[3] || 'src/data/imported-seasonal-rules.json';
const aliases = {
  airlineCode: ['航司代码', '航空公司代码', 'airlinecode', 'code'],
  airlineName: ['航司', '航空公司', '航空公司名称', 'airlinename'],
  origin: ['出发地', '始发地', '出发城市', '起点', 'origin'],
  destination: ['目的地', '到达地', '到达城市', '终点', 'destination'],
  cabin: ['舱位', '舱等', '客舱', 'cabin'],
  season: ['季节', '淡旺季', 'season'],
  mileage: ['里程', '兑换里程', '所需里程', '折扣里程', 'mileage'],
};

function clean(value) { return String(value ?? '').trim(); }
function findValue(record, candidates) {
  const entry = Object.entries(record).find(([key]) => candidates.includes(clean(key).toLowerCase()));
  return entry ? entry[1] : '';
}
function normalizeSeason(value) {
  const text = clean(value);
  if (/淡|light/i.test(text)) return 'light';
  if (/旺|peak|busy/i.test(text)) return 'peak';
  return text;
}
function normalizeRow(record, sheet, row) {
  const raw = Object.fromEntries(Object.entries(record).map(([key, value]) => [clean(key), value]));
  return {
    id: `${sheet}-${row}`,
    sheet,
    sourceRow: row,
    airlineCode: clean(findValue(raw, aliases.airlineCode)),
    airlineName: clean(findValue(raw, aliases.airlineName)),
    origin: clean(findValue(raw, aliases.origin)),
    destination: clean(findValue(raw, aliases.destination)),
    cabin: clean(findValue(raw, aliases.cabin)),
    season: normalizeSeason(findValue(raw, aliases.season)),
    mileage: Number(findValue(raw, aliases.mileage)) || null,
    raw,
  };
}

if (!fs.existsSync(input)) {
  console.error(`Source workbook not found: ${input}`);
  process.exit(1);
}

const workbook = XLSX.readFile(input, { cellDates: true });
const sheets = workbook.SheetNames.map((name) => {
  const sheet = workbook.Sheets[name];
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const headers = (matrix[0] || []).map(clean).filter(Boolean);
  const records = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return { name, headers, rowCount: records.length, columnCount: headers.length, rows: records.map((record, index) => normalizeRow(record, name, index + 2)) };
});
const rows = sheets.flatMap((sheet) => sheet.rows);
const dimensions = ['airlineCode', 'airlineName', 'origin', 'destination', 'cabin', 'season', 'mileage'];

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ source: path.basename(input), importedAt: new Date().toISOString(), dimensions, sheets: sheets.map(({ rows: _rows, ...summary }) => summary), rows }, null, 2));
console.log(`Imported ${rows.length} rows from ${sheets.length} sheet(s) to ${output}`);
console.log(`Query dimensions: ${dimensions.join(', ')}`);
