import React from "react";

interface TeamCardProps {
  teamName: string;
  headerBgClass: string;
  question: string;
  points: number;
  statusText: string;
  statusTextClass: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  teamName,
  headerBgClass,
  question,
  points,
  statusText,
  statusTextClass,
}) => {
  return (
    <div
      className="
        w-64 h-40
        bg-white rounded-lg shadow-lg ring-1 ring-black/5
        transition-all duration-300
        hover:shadow-xl hover:scale-105 hover:rotate-1
        flex flex-col
        floating
        transform
        even:rotate-[-1deg]
      "
    >
      {/* HEADER */}
      <div
        className={`
          ${headerBgClass} 
          rounded-t-lg 
          h-8 
          flex items-center px-3
          transition-colors duration-300
        `}
      >
        <span className="text-sm font-medium text-white leading-none">
          {teamName}
        </span>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-grow px-4 py-3 justify-between">
        {/* Question */}
        <p className="text-gray-900 font-semibold text-base leading-snug">
          {question}
        </p>

        {/* Footer pinned at bottom */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Points: {points}</span>
          <span className={`${statusTextClass} font-medium`}>
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
