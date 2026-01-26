
export interface FileNode {
  name: string;
  content: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface ProjectStructure {
  files: { [path: string]: string };
}

export enum AppState {
  IDLE = 'IDLE',
  SCRAPING = 'SCRAPING',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  READY = 'READY',
  ERROR = 'ERROR'
}

export interface ScrapedData {
  url: string;
  title: string;
  htmlSnippet: string;
  computedStyles: Record<string, any>;
  metadata: {
    colors: string[];
    fonts: string[];
  }
}
