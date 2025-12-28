import React, { useState } from 'react';
import { LogoRequest } from '../types';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface LogoFormProps {
  onSubmit: (data: LogoRequest) => void;
  isLoading: boolean;
}

const STYLES = [
  "Minimalist & Clean",
  "Abstract & Geometric",
  "Playful & Mascot",
  "Corporate & Professional",
  "Futuristic & Tech",
  "Hand-drawn & Organic"
];

export const LogoForm: React.FC<LogoFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LogoRequest>({
    companyName: '',
    industry: '',
    description: '',
    stylePreference: STYLES[0],
    colors: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
          <input
            type="text"
            name="companyName"
            required
            placeholder="e.g. Acme Corp"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              required
              placeholder="e.g. SaaS, Coffee Shop"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Style</label>
            <select
              name="stylePreference"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none appearance-none"
              value={formData.stylePreference}
              onChange={handleChange}
            >
              {STYLES.map(style => (
                <option key={style} value={style} className="bg-slate-900">{style}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Colors (Optional)</label>
          <input
            type="text"
            name="colors"
            placeholder="e.g. Blue and Silver, or #FF5733"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
            value={formData.colors}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">About the Brand</label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Describe your company's mission, vibe, and audience..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative group overflow-hidden rounded-xl bg-brand-600 p-4 font-semibold text-white shadow-lg transition-all hover:bg-brand-500 hover:shadow-brand-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-2 relative z-10">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating Design...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate Logo</span>
              <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>
        {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out" />}
      </button>
    </form>
  );
};