const fs = require('fs');
let code = fs.readFileSync('src/components/ProductAnalyzerScreen.tsx', 'utf8');

code = code.replace(
  /<label\s+htmlFor="camera-input-2"\s+onClick=\{\(e\) => e.stopPropagation\(\)\}\s+className="(py-1\.5 px-3 bg-\[#1B263B\] text-white text-\[10px\] font-bold rounded-lg cursor-pointer hover:bg-\[#253447\])"\s*>\s*Retake Photo\s*<\/label>/g,
  `<div className="relative overflow-hidden $1">Retake Photo<input type="file" onChange={handleFileChange} accept="image/*" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>`
);

code = code.replace(
  /<label\s+htmlFor="file-input-2"\s+onClick=\{\(e\) => e.stopPropagation\(\)\}\s+className="(py-1\.5 px-3 bg-white border border-stone-200 text-stone-600 text-\[10px\] font-bold rounded-lg cursor-pointer hover:text-\[#1B263B\])"\s*>\s*Replace from Gallery\s*<\/label>/g,
  `<div className="relative overflow-hidden $1">Replace from Gallery<input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>`
);

fs.writeFileSync('src/components/ProductAnalyzerScreen.tsx', code);
