const fs = require('fs');
const lines = fs.readFileSync('data.csv', 'utf8').split('\n');
const mapping = {};
lines.forEach(line => {
  if(!line.trim()) return;
  // Use regex to parse CSV line handling quotes
  const parts = [];
  let current = '';
  let inQuotes = false;
  for(let i=0; i<line.length; i++) {
    const char = line[i];
    if(char === '"' && line[i+1] === '"') { current += '"'; i++; }
    else if(char === '"') { inQuotes = !inQuotes; }
    else if(char === ',' && !inQuotes) { parts.push(current); current = ''; }
    else { current += char; }
  }
  parts.push(current);
  
  if(parts.length > 4) {
     let name = parts[0].trim();
     let ampm = parts[4].trim();
     if(name !== 'Ingredient') {
       mapping[name.toLowerCase()] = ampm;
     }
  }
});
console.log(JSON.stringify(mapping, null, 2));
