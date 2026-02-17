
export interface ScanningResult {
  musicXml: string;
  originalImage: string | null;
  status: 'idle' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: number;
  xml: string;
}
