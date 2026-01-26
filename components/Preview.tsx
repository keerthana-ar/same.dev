
import React from 'react';
import { ICONS } from '../constants';

interface PreviewProps {
  url: string;
  isLoading: boolean;
}

const Preview: React.FC<PreviewProps> = ({ url, isLoading }) => {
  return (
    <div className="h-full flex flex-col bg-slate-100 rounded-lg overflow-hidden border border-slate-300 shadow-2xl">
      <div className="bg-slate-200 px-4 py-2 border-b border-slate-300 flex items-center gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-slate-500 flex items-center gap-2 border border-slate-300">
          <ICONS.Globe size={12} />
          {url || 'https://your-target-site.com'}
        </div>
      </div>
      <div className="flex-1 bg-white relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-600 font-medium animate-pulse">Capturing site layout...</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mb-6 inline-flex p-4 bg-blue-50 rounded-full text-blue-500">
              <ICONS.Layout size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Live Reconstruction</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              The AI is currently processing the DOM structure and computed CSS properties 
              of <strong>{url}</strong> to generate the equivalent React components below.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {['Semantic HTML', 'Tailwind Utility', 'Responsive Flexbox', 'Color Palette'].map(tag => (
                <div key={tag} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-slate-600">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
