import React, { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FileText, CreditCard } from "lucide-react";
import IntroFlashCard from "./IntroFlashCard";

const UploadIntroSection: React.FC = () => (
  <section className="relative isolate overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600" />

    <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between">
      {/* left – Description */}
      <div className="max-w-lg text-white">
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Upload your Anki-Deck
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/90">
          Your optimal learning experience starts here.
        </p>
      </div>

      {/* right – feature cards */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Generate new cards */}
        <div className="flex items-start space-x-4 rounded-lg border border-white/20 bg-white/10 p-5 text-white backdrop-blur-sm">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-purple-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Generate new cards</p>
            <p className="mt-1 text-xs leading-relaxed text-white/90">
              Construct new questions and answers from your Anki decks. The possibilities are endless!
            </p>
          </div>
        </div>

        {/* Generate a summary */}
        <div className="flex items-start space-x-4 rounded-lg border border-white/20 bg-white/10 p-5 text-white backdrop-blur-sm">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Generate a summary</p>
            <p className="mt-1 text-xs leading-relaxed text-white/90">
              Create a summary of your Anki deck. Perfect for quick reviews before exams!
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const UploadPageSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".apkg")) {
      alert("Only .apkg files are allowed.");
      if (inputRef.current) inputRef.current.value = "";
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    if (!selectedFile) {
      alert("Please select an .apkg file first.");
      return;
    }
    // Hier später den echten Upload-Call einfügen
    console.log("Would upload:", selectedFile);
    alert(`File "${selectedFile.name}" is being uploaded.`);
  };

  return (
    <section className="flex min-h-fit items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 px-4 py-50">
      <div className="relative w-full max-w-md">
        {/* ─── Floating Flashcards (hidden on mobile) ─── */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {/* Top-Left */}
          <div className="absolute -top-20 -left-12 rotate-[-6deg] animate-float">
            <IntroFlashCard
              frontHeading="Biologie"
              frontText="Was ist die Funktion von Mitochondrien?"
              backText="Produktion von ATP durch Zellatmung."
            />
          </div>

          {/* Top-Center */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 rotate-[3deg] animate-float delay-150">
            <IntroFlashCard
              frontHeading="Philosophy"
              frontText="Who is the Author of 'Republic'?"
              backText="Plato"
            />
          </div>

          {/* Top-Right */}
          <div className="absolute -top-20 -right-12 rotate-[6deg] animate-float delay-300">
            <IntroFlashCard
              frontHeading="Chemistry"
              frontText="What is the molecular formula of water?"
              backText="H₂O"
            />
          </div>

          {/* Bottom-Left */}
          <div className="absolute -bottom-20 -left-10 rotate-[2deg] animate-float delay-200">
            <IntroFlashCard
              frontHeading="Mathematics"
              frontText="How do you solve x² − 4 = 0?"
              backText="x = ±2"
            />
          </div>

          {/* Bottom-Right */}
          <div className="absolute -bottom-20 -right-8 rotate-[-4deg] animate-float delay-100">
            <IntroFlashCard
              frontHeading="Physics"
              frontText="What does Einstein's E=mc² describe?"
              backText="Equivalence of mass and energy."
            />
          </div>
        </div>

        {/* ─── Upload Form in the Middle ─── */}
        <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8">
          {/* Logo / Title */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
              R
            </div>
            <span className="ml-2 text-purple-600 font-semibold text-xl">Recallr</span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Upload your Anki-Deck
          </h2>

          {/* File Input */}
          <label className="block mb-2 font-medium text-gray-700">
            Choose a .apkg file:
          </label>
          <input
            ref={inputRef}
            type="file"
            accept=".apkg"
            onChange={handleFileSelect}
            className="
              block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-600 file:text-white
              hover:file:bg-purple-700
              cursor-pointer
            "
          />

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className="mt-6 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Upload
          </button>
        </div>
      </div>
    </section>
  );
};

const UploadPage: React.FC = () => (
  <>
    <UploadIntroSection />
    <UploadPageSection />
  </>
);

export default UploadPage;
