'use client'
import { useState } from 'react';
import WelcomeScreen from "@/app/screens/welcomescreen";

export default function Home() {
  const [billData, setBillData] = useState(null);

  const handleNext = (data: any) => {
    setBillData(data);
    console.log('Bill processed:', data);
    // Navigate to results screen or show processing complete
  };

  return (
    <>
      <WelcomeScreen onNext={handleNext} />
    </>
  );
}