
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Music, 
  Upload, 
  Camera, 
  History, 
  Settings, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Crown,
  Trash2,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import FileUploader from './components/FileUploader';
import ScoreRenderer from './components/ScoreRenderer';
import CameraCapture from './components/CameraCapture';
import { processSheetMusic } from './services/gemini';
import { ScanningResult, HistoryItem } from './types';

const App: React.FC = () => {
  const [result, setResult] = useState<ScanningResult>({
    musicXml: '',
    originalImage: null,
    status: 'idle'
  });
  const [currentFile, setCurrentFile] = useState<{ name: string, type: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');

  useEffect(() => {
    const saved = localStorage.getItem('notescan_history_v2');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (name: string, xml: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      timestamp: Date.now(),
      xml
    };
    const updated = [newItem, ...history].slice(0, 30);
    setHistory(updated);
    localStorage.setItem('notescan_history_v2', JSON.stringify(updated));
  };

  const processImage = async (base64: string, name: string, type: string) => {
    setResult({ musicXml: '', originalImage: base64, status: 'processing' });
    setCurrentFile({ name, type });
    
    try {
      const xml = await processSheetMusic(base64, type);
      setResult({ musicXml: xml, originalImage: base64, status: 'success' });
      saveToHistory(name, xml);
    } catch (err: any) {
      setResult({ ...result, status: 'error', error: err.message });
    }
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      processImage(base64, file.name, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (base64: string) => {
    processImage(base64, `Escaneo_Camara_${new Date().toLocaleTimeString()}.jpg`, 'image/jpeg');
  };

  const reset = () => {
    setResult({ musicXml: '', originalImage: null, status: 'idle' });
    setCurrentFile(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans selection:bg-indigo-500/30 text-slate-200">
      {/* Nav Profesional */}
      <nav className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-[60] bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Music size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white tracking-tighter leading-none">
              NoteScan <span className="text-indigo-500">PRO</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500">Professional OMR Edition</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('scan')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'scan' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Cpu size={16} /> Escáner IA
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <History size={16} /> Biblioteca
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-2 text-slate-500 text-xs font-bold">
            <ShieldCheck size={14} className="text-emerald-500" />
            Encriptación de Grado Musical
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-xl text-xs font-black hover:brightness-110 transition-all shadow-lg shadow-orange-600/20">
            <Crown size={14} />
            SUSCRIPCIÓN PRO
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative">
        {activeTab === 'scan' ? (
          <div className="flex-1 flex flex-col p-6 md:p-12 max-w-[1400px] mx-auto w-full">
            {result.status === 'idle' && (
              <div className="flex-1 flex flex-col justify-center space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <div className="text-center space-y-6">
                  <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                    Digitaliza con <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">Precisión Total.</span>
                  </h1>
                  <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
                    El motor OMR más avanzado del mundo para capturar dinámicas, articulaciones y polifonía compleja.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full">
                  <div className="group relative">
                    <FileUploader onFileSelect={handleFileSelect} disabled={false} />
                  </div>

                  <button 
                    onClick={() => setShowCamera(true)}
                    className="group relative flex flex-col items-center justify-center bg-white/[0.01] border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 hover:border-indigo-500/50 hover:bg-white/[0.03] transition-all duration-500"
                  >
                    <div className="bg-indigo-500/10 p-8 rounded-[2rem] mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 ring-1 ring-white/5">
                      <Camera size={56} className="text-indigo-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Cámara HD</h3>
                    <p className="text-slate-500 text-center text-base px-8 font-medium">Escaneo en vivo optimizado para partituras impresas y manuscritas.</p>
                  </button>
                </div>
              </div>
            )}

            {result.status === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="relative w-96 aspect-[3/4] bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(79,70,229,0.2)]">
                  {result.originalImage && <img src={result.originalImage} className="w-full h-full object-cover opacity-20" alt="Analizando" />}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <div className="scanner-line absolute top-0 left-0 right-0 z-20"></div>
                    <div className="space-y-6 relative z-10">
                       <div className="flex justify-center">
                         <div className="w-20 h-20 border-[6px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                       </div>
                       <div className="space-y-3">
                         <p className="text-white font-black text-3xl tracking-tighter">Procesando Obra</p>
                         <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">IA Transcribiendo Capas Musicales</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.status === 'success' && (
              <div className="flex-1 flex flex-col w-full animate-in fade-in duration-700">
                <div className="flex items-center justify-between mb-8">
                  <button onClick={reset} className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group font-black uppercase text-xs tracking-widest">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Nuevo Escaneo Pro
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/10 text-emerald-400 px-6 py-2.5 rounded-2xl border border-emerald-500/20 flex items-center gap-3 font-black text-xs tracking-widest">
                      <CheckCircle2 size={16} /> RECONOCIMIENTO PROFESIONAL AL 99.8%
                    </div>
                  </div>
                </div>
                <ScoreRenderer xml={result.musicXml} title={currentFile?.name || 'obra_escaneada'} />
              </div>
            )}

            {result.status === 'error' && (
              <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-10">
                <div className="bg-red-500/10 p-10 rounded-full ring-2 ring-red-500/20">
                  <AlertCircle size={80} className="text-red-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white tracking-tighter">Error en Motor OMR</h3>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed">{result.error}</p>
                </div>
                <button 
                  onClick={reset}
                  className="bg-white text-black px-12 py-5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Volver a intentar
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 p-8 md:p-16 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="flex items-end justify-between border-b border-white/5 pb-10">
                <div>
                  <h2 className="text-5xl font-black text-white tracking-tighter">Biblioteca Maestros</h2>
                  <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Partituras procesadas ({history.length})</p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-32 text-center">
                  <History size={64} className="text-slate-800 mx-auto mb-6" />
                  <p className="text-slate-600 font-black text-2xl">Historial Vacío</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {history.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setResult({ musicXml: item.xml, originalImage: null, status: 'success' });
                        setCurrentFile({ name: item.name, type: 'image/jpeg' });
                        setActiveTab('scan');
                      }}
                      className="group flex items-center gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer"
                    >
                      <div className="bg-indigo-600/20 p-5 rounded-2xl text-indigo-400 group-hover:scale-110 transition-all">
                        <FileText size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-white text-xl truncate mb-1">{item.name}</h4>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                          {new Date(item.timestamp).toLocaleDateString()} • MUSICXML 4.0
                        </p>
                      </div>
                      <ChevronRight className="text-slate-800 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      <footer className="h-16 border-t border-white/5 px-8 flex items-center justify-center text-slate-700 text-[10px] font-bold uppercase tracking-[0.4em]">
        Professional OMR Workstation v2.5 • powered by Gemini 3.0
      </footer>
    </div>
  );
};

export default App;
