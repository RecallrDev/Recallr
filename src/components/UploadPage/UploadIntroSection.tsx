import React from "react";
import { FileText, CreditCard } from "lucide-react";

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

export default UploadIntroSection;