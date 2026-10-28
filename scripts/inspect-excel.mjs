import fs from 'node:fs';
import XLSX from 'xlsx';

const input = process.argv[2] || 'data/source.xlsx';
if (!fs.existsSync(input)) {
  console.error(`Source workbook not found: ${input}`);
  process.exit(1);
}

const workbook = XLSX.readFile(input, { cellDates: true });
console.log(`Workbook: ${input}`);
console.log(`Sheets: ${workbook.SheetNames.length}`);
for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name];
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const headers = (matrix[0] || []).map((value) => String(value).trim()).filter(Boolean);
  const records = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  console.log(`\n[${name}] ${records.length} data row(s), ${headers.length} column(s)`);
  console.log(`Fields: ${headers.join(' | ') || '(no header row detected)'}`);
  console.log(`Sample: ${JSON.stringify(records.slice(0, 2))}`);
}
