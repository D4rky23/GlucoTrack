import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload, accept = '.csv', disabled = false }) => {
  const [uploadStatus, setUploadStatus] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setUploadStatus({
        type: 'error',
        message: 'Invalid file type. Please upload a CSV file.'
      });
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadStatus({
        type: 'success',
        message: `File "${file.name}" selected successfully.`
      });
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
          }
          ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <svg 
            className={`w-12 h-12 ${isDragActive ? 'text-emerald-500' : 'text-gray-400'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          
          <div>
            {isDragActive ? (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                Drop the CSV file here
              </p>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Drag and drop a CSV file here, or click to select
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Supports CSV files only
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-md ${
          uploadStatus.type === 'error' 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
        }`}>
          <p className="text-sm">{uploadStatus.message}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
