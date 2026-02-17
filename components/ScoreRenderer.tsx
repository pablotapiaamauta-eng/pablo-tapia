
import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Download, FileText, ZoomIn, ZoomOut, Copy, Check, Maximize2 } from 'lucide-react';

interface ScoreRendererProps {
  xml: string;
  title: string;
}

const ScoreRenderer: React.FC<ScoreRendererProps> = ({ xml, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (containerRef.current && xml) {
      if (!osmdRef.current) {
        osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
          autoResize: true,
          drawTitle: true,
          drawSubtitle: true,
          drawComposer: true,
          drawingParameters: 'compact',
          renderBackend: 'canvas'
        });
      }

      osmdRef.current.load(xml).then(() => {
        osmdRef.current?.render();
        setIsReady(true);
      }).catch(err => {
        console.error("OSMD Loading error:", err);
      });
    }
  }, [xml]);

  useEffect(() => {
    if (osmdRef.current && isReady) {
      osmdRef.current.Zoom = zoom;
      osmdRef.current.render();
    }
  }, [zoom, isReady]);

  const handleDownload = () => {
    const blob = new Blob([xml], { type: 'application/vnd.recordare.musicxml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\.[^/.]+$/, "")}.musicxml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* ToolBar Profesional */}
      <div className="flex flex-wrap items-center justify-between p-5 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30">
            <FileText size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="font-black text-white text-base tracking-tight">Análisis Completado</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Fidelidad MusicXML 4.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white">
              <ZoomOut size={18} />
            </button>
            <span className="px-3 py-1 text-xs font-mono text-indigo-400 min-w-[4rem] text-center flex items-center justify-center font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom(z => Math.min(2.5, z + 0.1))} className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white">
              <ZoomIn size={18} />
            </button>
          </div>

          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/10"
          >
            {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar XML'}</span>
          </button>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Exportar .XML</span>
          </button>
        </div>
      </div>

      {/* Área de Visualización */}
      <div className="flex-1 overflow-auto p-4 md:p-10 bg-slate-950">
        <div 
          ref={containerRef} 
          className="score-container bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-auto rounded-sm min-h-screen transition-all duration-500 max-w-[850px]"
        />
      </div>
    </div>
  );
};

export default ScoreRenderer;
