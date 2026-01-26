
import React from 'react';
import { ICONS } from '../constants';

interface EditorProps {
  fileName: string;
  code: string;
  onChange: (newCode: string) => void;
}

const Editor: React.FC<EditorProps> = ({ fileName, code, onChange }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e293b]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700">
        <div className="flex items-center gap-2">
          <ICONS.FileCode className="text-blue-400" />
          <span className="text-sm font-medium text-slate-300">{fileName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigator.clipboard.writeText(code)}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            <ICONS.Copy size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 relative group">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-slate-300 code-font text-sm leading-relaxed resize-none outline-none focus:ring-0"
          spellCheck={false}
        />
        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded">
            Editable
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editor;
