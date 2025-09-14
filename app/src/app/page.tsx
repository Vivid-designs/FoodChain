'use client'
import { useState } from 'react';
import WelcomeScreen from '@/app/screens/welcomescreen';
import ResultsScreen, { BillItem, ItemAssignment, Person } from '@/app/screens/resultsscreen';

type Screen = 'welcome' | 'results';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  const handleWelcomeNext = (billData: any) => {
    // Convert API response to BillItem format
    const items: BillItem[] = billData.items.map((item: any, index: number) => ({
      id: index.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1  // Add quantity field
    }));
    
    setBillItems(items);
    setCurrentScreen('results');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
    setBillItems([]);
  };

  const handleResultsNext = (assignments: ItemAssignment[], people: Person[]) => {
    // TODO: Handle next step with assignments and people data
    console.log('Assignments:', assignments);
    console.log('People:', people);
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