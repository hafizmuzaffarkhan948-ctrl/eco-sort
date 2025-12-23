
import React, { useState, useRef } from 'react';
import { analyzeWaste } from './services/geminiService';
import { BinCategory, WasteAnalysis } from './types';
import { BIN_GUIDE } from './constants';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeWaste(base64);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again with a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getBinConfig = (cat: BinCategory) => BIN_GUIDE.find(b => b.category === cat);

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-6 shadow-md text-center">
        <div className="flex justify-center mb-2">
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 11L12 6L17 11M12 18V7M5 21H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Eco-Sort</h1>
        <p className="text-emerald-100 text-sm opacity-90">Waste Visual Classifier</p>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Upload Area */}
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-emerald-100 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 transition-all bg-emerald-50 group h-64"
          >
            <div className="bg-emerald-600 p-4 rounded-full text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-semibold text-emerald-800">Tap to Upload Photo</p>
            <p className="text-xs text-emerald-600 mt-2">Classify waste instantly</p>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-48 bg-slate-100">
              <img src={image} alt="Waste" className="w-full h-full object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="font-medium animate-pulse-slow">Analyzing...</p>
                  </div>
                </div>
              )}
              <button 
                onClick={reset}
                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-slate-600 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {result && !loading && (
              <div className={`rounded-2xl p-6 shadow-lg border-l-8 ${getBinConfig(result.category)?.colorClass.replace('bg-', 'border-')} ${getBinConfig(result.category)?.bgClass}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${getBinConfig(result.category)?.colorClass}`}></span>
                      {result.binNameEn}
                    </h2>
                    <h2 className="text-xl font-bold font-urdu text-right mt-1 rtl" dir="rtl">
                      {result.binNameUr}
                    </h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getBinConfig(result.category)?.colorClass}`}>
                    MATCHED
                  </div>
                </div>

                <div className="space-y-4 text-slate-700">
                  <p className="text-sm font-medium border-b border-black/5 pb-2">
                    Item detected: <span className="font-bold">{result.identifiedItem}</span>
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-xs uppercase font-bold text-slate-400 mb-1">Reason (English)</p>
                      <p className="text-sm leading-relaxed">{result.explanationEn}</p>
                    </div>
                    <div dir="rtl">
                      <p className="text-xs uppercase font-bold text-slate-400 mb-1">وضاحت (اردو)</p>
                      <p className="text-sm leading-relaxed font-urdu">{result.explanationUr}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={reset}
                  className="mt-6 w-full py-3 bg-white border border-slate-200 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sort Another
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Bin Guide Section */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Bin Guide / بن گائیڈ</h3>
          <div className="grid grid-cols-2 gap-3">
            {BIN_GUIDE.map((bin) => (
              <div key={bin.category} className={`${bin.bgClass} p-3 rounded-xl border border-black/5`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${bin.colorClass}`}></div>
                  <p className={`text-xs font-bold ${bin.textClass}`}>{bin.labelEn}</p>
                </div>
                <p className={`text-[10px] ${bin.textClass} opacity-80 leading-tight`}>
                  {bin.itemsEn[0]}, {bin.itemsEn[1]}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-400 text-xs mt-auto">
        <p>Keep our planet clean. 🌍</p>
        <p className="mt-1">Eco-Sort v1.0 • AI-Powered Efficiency</p>
      </footer>
    </div>
  );
};

export default App;
