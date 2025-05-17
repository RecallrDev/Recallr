import React from 'react';
import { Link } from 'react-router-dom';

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
            Anki Decks, <span className="text-purple-600">improved</span><br />
            for optimal learning
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Our platform enhances the proven Anki method with advanced features, analytics, and a user-friendly interface.
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

        {/* Right Visual Box */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white shadow-md rounded-xl p-6 w-80 text-center">
            <div className="bg-gray-100 h-40 mb-4 rounded-md flex items-center justify-center">
              {/* Placeholder Icon */}
              <span className="text-gray-400 text-3xl">+</span>
            </div>
            <h3 className="text-lg font-semibold">Intelligent Flashcards</h3>
            <p className="mt-2 text-sm text-gray-600">
              Our AI adapts to your learning behavior and optimizes your study time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
