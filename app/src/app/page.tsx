'use client';
import { COLORS } from "@/app/lib/colors";
import WelcomeScreen from "@/app/screens/welcomescreen";

export default function Home() {
  const handleNext = () => {
    console.log("Next clicked");
  };

  const handleCapture = (file: File) => {
    console.log("File captured:", file);
  };

  return (
    <>
      <WelcomeScreen onNext={handleNext} onCapture={handleCapture} />
    </>
  );
}