import React from "react";
import { Link } from "react-router-dom";
import IntroFlashCard from "../sub_components/IntroFlashCard";

const IntroSection: React.FC = () => {
  return (
    <section className="bg-purple-50 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">

        {/* Left Text Content */}
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-wide text-purple-600 font-medium">
            Revolutionize Your Learning
          </span>

          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Decks, <span className="text-purple-600">improved</span><br />
            for optimal learning
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Our platform enhances the proven Flashcard method with advanced features, analytics, and a user-friendly interface.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <Link
              to="/start"
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/learn-more"
              className="px-6 py-3 bg-white text-purple-600 font-semibold border border-purple-600 rounded-xl hover:bg-purple-100 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Flashcards, hidden on mobile */}
        <div className="w-full md:w-1/2 hidden md:flex flex-wrap justify-center gap-x-10 gap-y-6">

          {/* 1st card */}
          <div className="rotate-[-6deg] animate-float">
            <IntroFlashCard
              frontHeading="Biology"
              frontText="What is the difference between mitosis and meiosis?"
              backText="Mitosis produces two genetically identical cells; meiosis produces four genetically diverse gametes."
              color="#9810FA"
            />
          </div>

          {/* 2nd card */}
          <div className="rotate-[3deg] animate-float delay-150">
            <IntroFlashCard
              frontHeading="Mathematics"
              frontText="How do you calculate the derivative of f(x) = x²?"
              backText="f'(x) = 2x – apply the power rule."
              color="#9810FA"
            />
          </div>

          {/* 3rd card */}
          <div className="rotate-[1deg] animate-float delay-300">
            <IntroFlashCard
              frontHeading="History"
              frontText="What were the main causes of World War I?"
              backText="Imperialism, militarism, alliance systems, and nationalism."
              color="#9810FA"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
