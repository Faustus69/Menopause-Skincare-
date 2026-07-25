const fs = require('fs');

const dataFile = fs.readFileSync('src/data.ts', 'utf8');

const mapping = {
  "vitamin c (l-ascorbic acid)": "AM preferred",
  "niacinamide": "AM or PM",
  "peptides": "AM or PM",
  "retinol": "PM only",
  "glycolic acid": "PM preferred",
  "collagen (hydrolysed)": "AM or PM",
  "coenzyme q10 (ubiquinone)": "AM or PM",
  "bakuchiol": "AM or PM",
  "ergothioneine": "AM or PM",
  "astaxanthin": "AM preferred",
  "bee venom": "AM or PM",
  "alpha arbutin": "AM or PM",
  "licorice root extract": "AM or PM",
  "azelaic acid": "AM or PM",
  "txa (tranexamic acid)": "AM or PM",
  "lactic acid": "PM preferred",
  "n-acetyl glucosamine (nag)": "AM or PM",
  "colloidal oatmeal": "AM or PM",
  "squalane": "AM or PM",
  "ceramides": "AM or PM",
  "ha (hyaluronic acid)": "AM or PM",
  "centella asiatica": "AM or PM",
  "propolis": "AM or PM",
  "sea buckthorn oil": "AM or PM",
  "urea": "AM or PM",
  "glycerin": "AM or PM",
  "panthenol (pro-vitamin b5)": "AM or PM",
  "ectoin": "AM or PM",
  "beta-glucan": "AM or PM",
  "madecassoside": "AM or PM",
  "polyglutamic acid": "AM or PM",
  "allantoin": "AM or PM",
  "salicylic acid (bha)": "PM preferred",
  "zinc pca": "AM or PM"
};

let newDataFile = dataFile;

// Regex to find each ingredient object and its "ingredient" value
const regex = /"ingredient":\s*"([^"]+)",/g;
let match;
const updates = [];

while ((match = regex.exec(dataFile)) !== null) {
  const name = match[1].toLowerCase();
  const ampm = mapping[name] || "AM or PM";
  
  // Find the end of this object (the next '},' or the end of the array)
  // Or just insert it after the ingredient line
  const insertPos = match.index + match[0].length;
  updates.push({ pos: insertPos, ampm });
}

// apply backwards to avoid shifting index
for (let i = updates.length - 1; i >= 0; i--) {
  const { pos, ampm } = updates[i];
  newDataFile = newDataFile.substring(0, pos) + `\n    "suitabilityAMPM": "${ampm}",` + newDataFile.substring(pos);
}

fs.writeFileSync('src/data.ts', newDataFile, 'utf8');
console.log("Updated data.ts");

