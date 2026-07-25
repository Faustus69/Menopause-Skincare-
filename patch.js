const fs = require('fs');
let code = fs.readFileSync('src/components/ProductAnalyzerScreen.tsx', 'utf8');

const replacement = `</h3>

                  {/* Profile Compatibility Section */}
                  {result.goodMatches && result.goodMatches.ingredientNames.length > 0 && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <span className="text-[10px] text-emerald-800 font-bold tracking-widest uppercase font-sans flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Good match for you
                      </span>
                      <p className="text-sm font-bold text-emerald-900 mt-2">
                        Contains: {result.goodMatches.ingredientNames.join(', ')}
                      </p>
                      <p className="text-xs text-emerald-700 mt-1">
                        <span className="font-semibold">Best for:</span> {result.goodMatches.bestFor}
                      </p>
                    </div>
                  )}

                  {result.useWithCare && result.useWithCare.ingredientNames.length > 0 && (
                    <div className="mt-3 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                      <span className="text-[10px] text-rose-800 font-bold tracking-widest uppercase font-sans flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Use with care
                      </span>
                      <p className="text-sm font-bold text-rose-900 mt-2">
                        Also contains: {result.useWithCare.ingredientNames.join(', ')}
                      </p>
                      <p className="text-xs text-rose-700 mt-1">
                        <span className="font-semibold">Reason:</span> {result.useWithCare.reason}
                      </p>
                    </div>
                  )}
                  </div>
`;

code = code.replace(/<\/h3>[\s\S]*?<\/div>[\s]*<\/div>[\s]*{\/\* Overall Summary \*\/}/m, replacement + '\n                </div>\n\n                {/* Overall Summary */}');
fs.writeFileSync('src/components/ProductAnalyzerScreen.tsx', code);
