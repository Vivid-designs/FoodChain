'use client'
import React, { useState } from 'react';
import { COLORS } from '../lib/colors';

export interface BillItem {
  id: string;
  name: string;
  price: number;
}

export interface ResultsScreenProps {
  items: BillItem[];
  onBack: () => void;
  onNext: (selectedItems: BillItem[]) => void;
}

export default function ResultsScreen({ items, onBack, onNext }: ResultsScreenProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectedTotal = items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const billTotal = items.reduce((sum, item) => sum + item.price, 0);

  const handleNext = () => {
    const selectedItemsArray = items.filter(item => selectedItems.has(item.id));
    onNext(selectedItemsArray);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-700">Select Your Items</h1>
          <p className="text-gray-600">Choose what you ordered from the bill</p>
        </div>

        {/* Bill Items */}
        <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
          {items.map((item, index) => {
            const isSelected = selectedItems.has(item.id);
            const colorIndex = index % COLORS.length;
            const itemColor = COLORS[colorIndex];

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: itemColor }}
                  />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-900 font-semibold">R{item.price.toFixed(2)}</span>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="bg-white rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Bill Total:</span>
            <span>R{billTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
            <span>Your Total:</span>
            <span>R{selectedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={selectedItems.size === 0}
            className={`flex-1 py-3 text-white rounded-lg transition duration-300 ${
              selectedItems.size === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Continue ({selectedItems.size} items)
          </button>
        </div>
      </div>
    </div>
  );
}