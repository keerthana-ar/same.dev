
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
  files: { [path: string]: string };
  selectedFile: string;
  onSelectFile: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ files, selectedFile, onSelectFile }) => {
  const filePaths = Object.keys(files).sort();

  return (
    <div className="w-64 border-r border-slate-800 bg-[#0f172a] flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Explorer</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {filePaths.map((path) => {
          const isSelected = path === selectedFile;
          const fileName = path.split('/').pop() || path;
          const depth = path.split('/').length - 1;

          return (
            <button
              key={path}
              onClick={() => onSelectFile(path)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors group ${
                isSelected 
                  ? 'bg-blue-500/10 text-blue-400 border-r-2 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
              style={{ paddingLeft: `${16 + depth * 12}px` }}
            >
              <ICONS.FileCode size={14} className={isSelected ? 'text-blue-400' : 'text-slate-500'} />
              <span className="truncate">{fileName}</span>
            </button>
          );
        })}
      </div>
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Synced with AI</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
