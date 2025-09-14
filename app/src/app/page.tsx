'use client'
import { useState } from 'react';
import WelcomeScreen from '@/app/screens/welcomescreen';
import ResultsScreen, { BillItem } from '@/app/screens/resultsscreen';

type Screen = 'welcome' | 'results';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  const handleWelcomeNext = (billData: any) => {
    // Convert API response to BillItem format
    const items: BillItem[] = billData.items.map((item: any, index: number) => ({
      id: index.toString(),
      name: item.name,
      price: item.price
    }));
    
    setBillItems(items);
    setCurrentScreen('results');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
    setBillItems([]);
  };

  const handleResultsNext = (selectedItems: BillItem[]) => {
    // TODO: Handle next step with selected items
    console.log('Selected items:', selectedItems);
  };

  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen 
        onNext={handleWelcomeNext}
      />
    );
  }

  if (currentScreen === 'results') {
    return (
      <ResultsScreen 
        items={billItems}
        onBack={handleBackToWelcome}
        onNext={handleResultsNext}
      />
    );
  }

  return null;
}