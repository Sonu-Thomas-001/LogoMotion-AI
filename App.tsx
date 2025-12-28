import React, { useState } from 'react';
import { LogoForm } from './components/LogoForm';
import { LogoPreview } from './components/LogoPreview';
import { generateLogo } from './services/geminiService';
import { LogoData, LogoRequest } from './types';
import { Hexagon, LayoutGrid, Github } from 'lucide-react';

export default function App() {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (request: LogoRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateLogo(request);
      setLogoData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 font-sans selection:bg-brand-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Hexagon className="w-5 h-5 text-white" fill="currentColor" fillOpacity={0.2} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Lumina<span className="text-brand-400">Logo</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <a href="#" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
               <LayoutGrid className="w-4 h-4" />
               Gallery
             </a>
             <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Intro Hero (Only show if no logo generated yet) */}
        {!logoData && !isLoading && (
          <div className="text-center mb-16 max-w-2xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              Design your brand identity <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">in seconds with AI</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              Generate unique, export-ready SVG logos with automatic animations for your startup, app, or side project.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className={`lg:col-span-4 space-y-8 transition-all duration-500 ${logoData ? '' : 'lg:col-start-3 lg:col-span-8'}`}>
            <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-xl border-t border-white/10">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs">1</span>
                  Describe your Brand
                </h2>
              </div>
              <LogoForm onSubmit={handleGenerate} isLoading={isLoading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
            </div>

            {/* Features List (Only visible when form is centered/no logo) */}
            {!logoData && !isLoading && (
               <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="font-semibold text-white mb-1">Vector SVG</div>
                    <div className="text-xs text-slate-500">Infinite scalability</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="font-semibold text-white mb-1">Animated</div>
                    <div className="text-xs text-slate-500">Ready for web intros</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="font-semibold text-white mb-1">Commercial</div>
                    <div className="text-xs text-slate-500">Free to use anywhere</div>
                  </div>
               </div>
            )}
          </div>

          {/* Right Column: Preview */}
          {(logoData || isLoading) && (
            <div className="lg:col-span-8 animate-fade-in-right">
              <div className="glass-panel p-2 rounded-2xl shadow-2xl border-t border-white/10 min-h-[600px] flex flex-col">
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                     <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-6"></div>
                     <h3 className="text-xl font-medium text-white mb-2">Dreaming up ideas...</h3>
                     <p className="text-slate-400 max-w-sm">
                       Our AI is analyzing your industry trends, selecting color palettes, and drafting vector shapes.
                     </p>
                  </div>
                ) : (
                  logoData && <LogoPreview data={logoData} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}