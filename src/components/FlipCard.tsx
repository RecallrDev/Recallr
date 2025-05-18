import React from 'react';

export type FlipCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FlipCard: React.FC<FlipCardProps> = ({ icon, title, description }) => (
  <div className="flip-card w-full h-64">
    <div className="flip-card-inner">

      {/* FRONT */}
      <div className="flip-card-front flex flex-col items-center justify-center bg-gray-100 p-6 rounded-xl shadow-sm">
        <div className="text-purple-600 mb-2">{icon}</div>
        <h3 className="text-gray-900 font-semibold text-lg">{title}</h3>
        <span className="mt-1 text-xs text-gray-500">Flip me! ↻</span>
      </div>

      {/* BACK */}
      <div className="flip-card-back flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm">
        <div className="text-purple-600 mb-2">{icon}</div>
        <p className="text-gray-700 text-center">{description}</p>
      </div>

    </div>
  </div>
);

export default FlipCard;