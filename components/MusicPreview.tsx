
import React from 'react';

interface MusicPreviewProps {
  xml: string;
  filename: string;
}

const MusicPreview: React.FC<MusicPreviewProps> = ({ xml, filename }) => {
  const handleDownload = () => {
    const blob = new Blob([xml], { type: 'application/vnd.recordare.musicxml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.[^/.]+$/, "") + ".musicxml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-slate-800">Scan Result</h4>
          <p className="text-xs text-slate-500">MusicXML 4.0 Generated</p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export MusicXML
        </button>
      </div>
      
      <div className="p-6">
        <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-sm overflow-auto max-h-[400px]">
          <pre>{xml.length > 2000 ? xml.substring(0, 2000) + "\n... (more code)" : xml}</pre>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-700">
            <strong>Pro Tip:</strong> You can import this .musicxml file into software like Musescore, Finale, or Sibelius to hear the audio and edit the notation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MusicPreview;
