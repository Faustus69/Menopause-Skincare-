import XLSX from 'xlsx';

const { readFile, utils } = XLSX;

async function findInSheet() {
  const workbook = readFile('sheet.xlsx');
  const sheetName = 'Full Ingredient Table';
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return;
  const rows = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  rows.forEach((row, i) => {
    if (!row[2]) return;
    const name = String(row[2]);
    if (name.toLowerCase().includes('copper') || name.toLowerCase().includes('salicylic') || name.toLowerCase().includes('acid')) {
      console.log(`Row ${i}: "${name}"`);
    }
  });
}

findInSheet().catch(console.error);








