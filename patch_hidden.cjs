const fs = require('fs');
let code = fs.readFileSync('src/components/ProductAnalyzerScreen.tsx', 'utf8');

code = code.replace(
  /\{\/\* Hidden files\/albums input selector \*\/\}\s*<input id="file-input-2" type="file" ref=\{fileInputRef\} onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*onChange=\{handleFileChange\}\s*accept="image\/\*"\s*className="hidden"\s*\/>\s*\{\/\* Hidden live camera capture input selector \*\/\}\s*<input id="camera-input-2" type="file" ref=\{cameraInputRef\} onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*onChange=\{handleFileChange\}\s*accept="image\/\*"\s*capture="environment"\s*className="hidden"\s*\/>/g,
  ''
);

fs.writeFileSync('src/components/ProductAnalyzerScreen.tsx', code);
