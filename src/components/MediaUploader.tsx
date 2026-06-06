import React, { useState, useRef } from 'react';
import { Film, Upload, X, FileText, Music } from 'lucide-react';

interface MediaUploaderProps {
  onFileSelect: (file: File) => void;
  mediaType: 'audio' | 'video' | 'pdf';
  isOptional?: boolean;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onFileSelect, mediaType, isOptional = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    // Check file type
    const isValidType = 
      (mediaType === 'video' && file.type.startsWith('video/')) ||
      (mediaType === 'audio' && file.type.startsWith('audio/')) ||
      (mediaType === 'pdf' && file.type === 'application/pdf');

    if (!isValidType) {
      alert(`Please upload a valid ${mediaType} file`);
      return;
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 100MB');
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
    
    // Create preview URL for audio and video
    if (mediaType !== 'pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getAcceptTypes = () => {
    switch (mediaType) {
      case 'video':
        return 'video/mp4,video/webm,video/ogg';
      case 'audio':
        return 'audio/mpeg,audio/wav,audio/ogg';
      case 'pdf':
        return 'application/pdf';
      default:
        return '';
    }
  };

  const getMediaIcon = () => {
    switch (mediaType) {
      case 'video':
        return <Film className="text-slate-400 mb-2" size={32} />;
      case 'audio':
        return <Music className="text-slate-400 mb-2" size={32} />;
      case 'pdf':
        return <FileText className="text-slate-400 mb-2" size={32} />;
      default:
        return <Upload className="text-slate-400 mb-2" size={32} />;
    }
  };

  const getFileTypeText = () => {
    switch (mediaType) {
      case 'video':
        return 'MP4, WebM, or Ogg';
      case 'audio':
        return 'MP3, WAV, or OGG';
      case 'pdf':
        return 'PDF';
      default:
        return '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Upload {mediaType === 'video' ? 'Video' : mediaType === 'audio' ? 'Audio' : 'PDF'} {!isOptional && <span className="text-red-500">*</span>}
      </label>
      
      {!selectedFile ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center">
            {getMediaIcon()}
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">
              {getFileTypeText()} (Max 100MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file" 
            className="hidden"
            onChange={handleChange}
            accept={getAcceptTypes()}
            id="media-upload"
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {getMediaIcon()}
              <span className="text-sm text-slate-700 truncate max-w-xs ml-2">
                {selectedFile.name}
              </span>
            </div>
            <button 
              onClick={removeFile}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {previewUrl && mediaType === 'video' && (
            <video 
              src={previewUrl} 
              controls 
              className="w-full h-auto rounded mt-2"
            />
          )}
          
          {previewUrl && mediaType === 'audio' && (
            <audio 
              src={previewUrl} 
              controls 
              className="w-full mt-2"
            />
          )}

          {mediaType === 'pdf' && (
            <div className="mt-2 p-2 bg-slate-50 rounded">
              <p className="text-sm text-slate-600">
                PDF file selected: {selectedFile.name}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;