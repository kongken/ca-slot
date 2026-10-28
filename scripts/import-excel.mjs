import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const input = process.argv[2] || 'data/source.xlsx';
const output = process.argv[3] || 'src/data/imported-seasonal-rules.json';
if (!fs.existsSync(input)) {
  console.error(`Source workbook not found: ${input}`);
  process.exit(1);
}

const workbook = XLSX.readFile(input, { cellDates: true });
const rows = [];
for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const values = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  values.forEach((record, index) => {
    const normalized = Object.fromEntries(Object.entries(record).map(([key, value]) => [String(key).trim(), value]));
    rows.push({ sheet: sheetName, row: index + 2, ...normalized });
  });
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ source: path.basename(input), sheets: workbook.SheetNames, importedAt: new Date().toISOString(), rows }, null, 2));
console.log(`Imported ${rows.length} rows from ${workbook.SheetNames.length} sheet(s) to ${output}`);
