// src/components/FileUploadButton.tsx
"use client"

import React, { useState, useRef } from 'react';
import { getSocket } from '@/src/services/socketService';

interface FileUploadButtonProps {
  sessionId: string;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: string) => void;
  // Add a new prop for handling file uploads and showing in chat
  onFileUploaded?: (fileName: string) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  sessionId,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onFileUploaded
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onUploadError?.("File size exceeds 10MB limit");
      return;
    }
    
    // Check file type
    const validFileTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword',
      'image/png', 
      'image/jpeg', 
      'image/gif', 
      'image/bmp', 
      'image/tiff'
    ];
    
    if (!validFileTypes.includes(file.type)) {
      onUploadError?.("Unsupported file type. Please upload PDF, DOCX, DOC, or common image formats.");
      return;
    }
    
    try {
      setIsUploading(true);
      onUploadStart?.();
      setUploadProgress(10);
      
      // Read file as base64
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        setUploadProgress(20);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 50) + 20;
          setUploadProgress(progress);
        }
      };
      
      reader.onload = async () => {
        setUploadProgress(70);
        
        const base64Data = (reader.result as string).split(',')[1];
        const socket = getSocket();
        
        if (!socket) {
          throw new Error("Socket connection not available");
        }
        
        // Setup error handler for this specific session
        const errorHandler = (errorMsg: string) => {
          onUploadError?.(errorMsg);
          socket.off(`error-${sessionId}`, errorHandler);
          setIsUploading(false);
          setUploadProgress(0);
        };
        
        socket.on(`error-${sessionId}`, errorHandler);
        
        // Call the onFileUploaded callback to immediately show the file in chat
        // This will display a temporary message while the actual content loads
        if (onFileUploaded) {
          onFileUploaded(file.name);
        }
        
        // Send file data through socket
        socket.emit("upload_document", {
          sessionId,
          fileData: base64Data,
          fileName: file.name,
          fileType: file.type
        });
        
        setUploadProgress(100);
        
        // Clean up
        setTimeout(() => {
          socket.off(`error-${sessionId}`, errorHandler);
          setIsUploading(false);
          setUploadProgress(0);
          onUploadComplete?.();
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 1000);
      };
      
      reader.onerror = () => {
        throw new Error("Error reading file");
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("File upload error:", error);
      onUploadError?.(error instanceof Error ? error.message : "File upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
        disabled={isUploading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`
          flex items-center gap-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Upload file"
        title="Upload document (PDF, Word, Images)"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        
        {isUploading && (
          <div className="absolute -top-8 left-0 w-full">
            <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default FileUploadButton;