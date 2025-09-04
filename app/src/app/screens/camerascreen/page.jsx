'use client';

import { useRef } from 'react';

export default function CameraScreen() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-200 rounded-2xl p-8 text-center space-y-6 shadow-lg">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-700">Capture or Select Image</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Take a photo or choose one from your gallery.
          </p>
        </div>
        <div className="py-4">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-gray-300 hover:text-blue-600 transition duration-300"
            onClick={handleButtonClick}
          >
            Open Camera
          </button>
        </div>
      </div>
    </div>
  );
}