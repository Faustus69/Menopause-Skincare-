const fs = require('fs');
let code = fs.readFileSync('src/components/ProductAnalyzerScreen.tsx', 'utf8');

// Replace Option 1
code = code.replace(
  /<label\s+htmlFor="camera-input-2"\s+onClick=\{\(e\) => e.stopPropagation\(\)\}\s+className="(flex-1 py-2\.5 px-4 bg-\[#1B263B\] text-white[^"]+)"\s*>\s*<Camera className="w-3\.5 h-3\.5 stroke-\[2\]" \/>\s*<span>Take Photo<\/span>\s*<\/label>/g,
  `<div className="relative overflow-hidden $1"><Camera className="w-3.5 h-3.5 stroke-[2]" /><span>Take Photo</span><input type="file" onChange={handleFileChange} accept="image/*" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>`
);

// Replace Option 2
code = code.replace(
  /<label\s+htmlFor="file-input-2"\s+onClick=\{\(e\) => e.stopPropagation\(\)\}\s+className="(flex-1 py-2\.5 px-4 bg-white border border-\[#E2B4BD\] text-\[#1B263B\][^"]+)"\s*>\s*<Upload className="w-3\.5 h-3\.5 text-\[#DAA89B\]" \/>\s*<span>Browse Files<\/span>\s*<\/label>/g,
  `<div className="relative overflow-hidden $1"><Upload className="w-3.5 h-3.5 text-[#DAA89B]" /><span>Browse Files</span><input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>`
);

fs.writeFileSync('src/components/ProductAnalyzerScreen.tsx', code);
