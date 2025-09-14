'use client'
import React, { useRef, useState } from 'react';

export interface WelcomeScreenProps {
  onNext: (billData: any) => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCapture = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/process-bill', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process bill');
      }

      const billData = await response.json();
      onNext(billData);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process the bill. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-200 rounded-2xl p-8 text-center space-y-6 shadow-lg">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-700">Welcome to FoodChain</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Take a picture, select your food items, and stop worrying about the bill!
          </p>
        </div>

        <div className="py-4">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageCapture(file);
            }}
          />
          <button
            className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-gray-300 hover:text-blue-600 transition duration-300 disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Take a Pic'}
          </button>
        </div>
      </div>
    </div>
  );
}