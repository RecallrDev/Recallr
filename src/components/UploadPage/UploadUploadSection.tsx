import React, { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import IntroFlashCard from "../Cosmetics/IntroFlashCard";

const UploadUploadSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".txt")) {
      alert("Only .txt files are allowed.");
      if (inputRef.current) inputRef.current.value = "";
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadClick = async () => {
    setError(null);
    setJsonOutput(null);

    if (!selectedFile) {
      setError("Please select an .txt file first.");
      return;
    }

    console.log("Uploading file:", selectedFile);
    const formData = new FormData();
    formData.append("file", selectedFile);

    console.log("FormData:", formData);
  };

  return (
    <section className="flex min-h-fit items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 px-4 py-50">
      <div className="relative w-full max-w-md">
        {/* ─── Floating Flashcards (hidden on mobile) ─── */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {/* Top-Left */}
          <div className="absolute -top-20 -left-12 rotate-[-6deg] animate-float">
            <IntroFlashCard
              frontHeading="Biology"
              frontText="What is the purpose of mitochondrias??"
              backText="Production of ATP by Cell Breathing."
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
            Choose a .txt file:
          </label>
          <input
            ref={inputRef}
            type="file"
            accept=".txt"
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
            disabled={!selectedFile || !selectedFile.name.toLowerCase().endsWith(".txt")}
            className={`
              mt-6 w-full font-semibold py-2 rounded-lg transition
              ${!selectedFile || !selectedFile.name.toLowerCase().endsWith(".txt")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
              }
            `}
          >
            Upload
          </button>

          {error && <p className="mt-4 text-red-600">Error: {error}</p>}
          {jsonOutput && (
            <div className="mt-4">
              <h3 className="font-medium">JSON Output:</h3>
              <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                {jsonOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadUploadSection;
