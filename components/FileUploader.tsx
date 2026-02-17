
import React, { useRef } from 'react';
import { Upload, FileType } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div 
      className={`group relative border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden
        ${disabled ? 'bg-white/5 border-white/10 opacity-50' : 'bg-white/[0.01] border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.03]'}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef}
        accept="image/*,application/pdf"
        onChange={(e) => {
          if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
        }}
        disabled={disabled}
      />
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 bg-indigo-600/10 p-8 rounded-[2rem] mb-6 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all duration-500 ring-1 ring-white/5">
        <Upload size={56} className="text-indigo-400" />
      </div>
      
      <div className="relative z-10 text-center space-y-2">
        <h3 className="text-3xl font-black text-white tracking-tight">Subir Partitura</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-base font-medium leading-relaxed">
          Soporta PDF multi-página, PNG, JPG de alta resolución.
        </p>
      </div>

      <div className="relative z-10 mt-10 flex gap-3">
        {['PDF', 'JPG', 'PNG'].map(fmt => (
          <span key={fmt} className="px-5 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-black tracking-widest uppercase group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
