
import React, { useState, useCallback } from 'react';
import { AppState, ProjectStructure } from './types';
import { ICONS } from './constants';
import { scrapeUrl } from './services/scraper';
import { generateReactCode } from './services/gemini';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [project, setProject] = useState<ProjectStructure | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleClone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setAppState(AppState.SCRAPING);
      setError(null);
      
      const scrapedData = await scrapeUrl(url);
      
      setAppState(AppState.ANALYZING);
      // Brief pause for effect
      await new Promise(r => setTimeout(r, 1000));
      
      setAppState(AppState.GENERATING);
      const generatedProject = await generateReactCode(
        scrapedData.htmlSnippet,
        scrapedData.computedStyles,
        url
      );
      
      setProject(generatedProject);
      const firstFile = Object.keys(generatedProject.files)[0];
      setSelectedFile(firstFile);
      setAppState(AppState.READY);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during cloning.");
      setAppState(AppState.ERROR);
    }
  };

  const handleUpdateCode = (newCode: string) => {
    if (!project || !selectedFile) return;
    setProject({
      ...project,
      files: {
        ...project.files,
        [selectedFile]: newCode
      }
    });
  };

  const handleDownload = () => {
    if (!project) return;
    const blob = new Blob([JSON.stringify(project.files, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconstructed-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <ICONS.Code className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Same.Dev
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
            Alpha
          </span>
        </div>

        <form onSubmit={handleClone} className="flex-1 max-w-2xl mx-12">
          <div className="relative group">
            <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="url" 
              placeholder="Paste website URL to clone... (e.g., https://example.com)" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 pl-12 pr-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-200"
              required
            />
            <button 
              type="submit"
              disabled={appState !== AppState.IDLE && appState !== AppState.READY && appState !== AppState.ERROR}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              {appState === AppState.IDLE || appState === AppState.READY ? 'Clone UI' : 'Processing...'}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownload}
            disabled={!project}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-sm font-medium transition-all"
          >
            <ICONS.Download size={16} />
            Export Project
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {appState === AppState.IDLE ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#0f172a_100%)]">
            <div className="max-w-3xl">
              <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
                Instantly turn any website into <br/>
                <span className="text-blue-500">clean React code.</span>
              </h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Harness the power of Playwright and Gemini to reconstruct the UI of any webpage. 
                Get semantic HTML, perfect Tailwind classes, and modular project structures in seconds.
              </p>
              
              <div className="grid grid-cols-3 gap-8">
                {[
                  { title: "Smart Parsing", desc: "Detects layout patterns and flex/grid systems automatically." },
                  { title: "Pure Tailwind", desc: "No bulky CSS. Everything is converted to clean utility classes." },
                  { title: "Next.js Ready", desc: "Output follows the latest App Router standards and practices." }
                ].map(feature => (
                  <div key={feature.title} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : appState === AppState.ERROR ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#0f172a]">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-3xl font-bold">!</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Cloning Failed</h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <button 
                onClick={() => setAppState(AppState.IDLE)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Project Sidebar */}
            <Sidebar 
              files={project?.files || {}} 
              selectedFile={selectedFile} 
              onSelectFile={setSelectedFile} 
            />

            {/* Editor and Preview Split */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 grid grid-cols-2 gap-px bg-slate-800">
                {/* Code Editor */}
                <div className="overflow-hidden">
                  {selectedFile && project ? (
                    <Editor 
                      fileName={selectedFile} 
                      code={project.files[selectedFile]} 
                      onChange={handleUpdateCode} 
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-[#1e293b]">
                      <p className="text-slate-500 animate-pulse">Waiting for AI to generate components...</p>
                    </div>
                  )}
                </div>

                {/* Visual Analysis View */}
                <div className="p-4 bg-slate-900 overflow-hidden">
                  <Preview 
                    url={url} 
                    isLoading={appState === AppState.SCRAPING || appState === AppState.ANALYZING || appState === AppState.GENERATING} 
                  />
                </div>
              </div>
              
              {/* Status Bar */}
              <div className="h-10 bg-[#0f172a] border-t border-slate-800 flex items-center justify-between px-6 text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${appState === AppState.READY ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`} />
                    <span>Status: {appState}</span>
                  </div>
                  {project && (
                    <div className="flex items-center gap-2">
                      <ICONS.FileCode size={12} />
                      <span>{Object.keys(project.files).length} Files Generated</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span>Reconstructed with Gemini 2.5 Flash</span>
                  <span className="text-slate-700">|</span>
                  <span>Responsive Mode: ON</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
