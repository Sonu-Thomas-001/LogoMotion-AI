import React, { useState, useEffect, useRef } from 'react';
import { LogoData, AnimationType } from '../types';
import { Download, Copy, Check, Play, Settings2, Code, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoPreviewProps {
  data: LogoData;
}

const ANIMATIONS: { id: AnimationType; label: string }[] = [
  { id: 'none', label: 'Static' },
  { id: 'draw', label: 'Draw Lines' },
  { id: 'fade', label: 'Fade In' },
  { id: 'pop', label: 'Pop Up' },
  { id: 'spin', label: 'Spin' },
  { id: 'float', label: 'Float' },
];

export const LogoPreview: React.FC<LogoPreviewProps> = ({ data }) => {
  const [activeAnimation, setActiveAnimation] = useState<AnimationType>('none');
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Ref to the SVG container to manipulate SVG properties if needed
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Reset animation when data changes
  useEffect(() => {
    setActiveAnimation('none');
    
    // Tiny timeout to trigger generic entrance if desired
    const t = setTimeout(() => setActiveAnimation('pop'), 500);
    return () => clearTimeout(t);
  }, [data]);

  const handleDownload = () => {
    const blob = new Blob([data.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.companyName.replace(/\s+/g, '-').toLowerCase()}-logo.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Animation Styles Injection
  // We use a style tag to inject keyframes dynamically based on selection
  const getAnimationStyles = () => {
    if (activeAnimation === 'draw') {
      return `
        @keyframes drawPath {
          from { stroke-dasharray: 1000; stroke-dashoffset: 1000; fill-opacity: 0; }
          to { stroke-dashoffset: 0; fill-opacity: 1; }
        }
        .generated-logo svg path, 
        .generated-logo svg circle, 
        .generated-logo svg rect, 
        .generated-logo svg ellipse, 
        .generated-logo svg line, 
        .generated-logo svg polyline, 
        .generated-logo svg polygon {
          animation: drawPath 2s ease-out forwards;
          stroke: currentColor; 
          /* Ensure stroke exists for effect, though fill might take over later */
        }
      `;
    }
    if (activeAnimation === 'spin') {
      return `
        @keyframes spinLogo {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .generated-logo svg {
          animation: spinLogo 10s linear infinite;
          transform-origin: center;
        }
      `;
    }
    if (activeAnimation === 'float') {
      return `
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .generated-logo svg {
          animation: floatLogo 3s ease-in-out infinite;
        }
      `;
    }
    return '';
  };

  // Framer motion variants for the container
  const containerVariants = {
    none: { opacity: 1, scale: 1 },
    fade: { opacity: [0, 1], transition: { duration: 1 } },
    pop: { scale: [0.5, 1.1, 1], opacity: [0, 1], transition: { type: "spring", stiffness: 260, damping: 20 } },
    spin: { opacity: 1 }, // Handled by CSS
    float: { opacity: 1 }, // Handled by CSS
    draw: { opacity: 1 } // Handled by CSS
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Top Bar: Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <Settings2 className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.id}
              onClick={() => setActiveAnimation(anim.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                activeAnimation === anim.id 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {anim.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button 
            onClick={() => setShowCode(!showCode)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Toggle Code View"
          >
            {showCode ? <Eye className="w-5 h-5" /> : <Code className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="relative flex-1 min-h-[400px] flex flex-col rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
        <style>{getAnimationStyles()}</style>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}></div>

        <div className="relative flex-1 flex items-center justify-center p-12">
           <AnimatePresence mode="wait">
            {showCode ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full max-h-[400px] overflow-auto bg-slate-950 rounded-lg p-4 text-xs font-mono text-slate-400 border border-slate-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500">logo.svg</span>
                  <button onClick={handleCopyCode} className="text-brand-400 hover:text-brand-300">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap break-all">{data.svg}</pre>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                variants={containerVariants}
                initial="none"
                animate={activeAnimation}
                className={`generated-logo w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl ${activeAnimation === 'draw' ? 'draw-active' : ''}`}
                ref={svgContainerRef}
                dangerouslySetInnerHTML={{ __html: data.svg }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-800/80 backdrop-blur-md p-4 border-t border-slate-700/50">
          <div className="flex items-start justify-between gap-4">
             <div>
               <h3 className="text-sm font-semibold text-white">{data.companyName}</h3>
               <p className="text-xs text-slate-400 mt-1 max-w-md">{data.explanation}</p>
             </div>
             <div className="flex gap-1.5">
               {data.palette.map((color, idx) => (
                 <div 
                   key={idx} 
                   className="w-6 h-6 rounded-full border border-slate-600/50 shadow-sm" 
                   style={{ backgroundColor: color }}
                   title={color}
                 />
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};