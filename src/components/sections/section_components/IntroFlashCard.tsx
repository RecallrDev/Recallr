import React from "react";

export type IntroFlashCardProps = {
  frontHeading: string;
  frontText: string;
  backText: string;
  color: string;
}

const IntroFlashCard: React.FC<IntroFlashCardProps> = ({
  frontHeading,
  frontText,
  backText,
  color
}) => {
  return (
    <div className="group [perspective:1000px] floating cursor-pointer hover:scale-[1.02] transition-transform">
      <div
        className="relative h-40 w-72 transition-transform duration-[600ms]
                   [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 rounded-xl bg-white shadow-lg ring-1 ring-black/5
                     flex flex-col justify-center px-5 pt-8 pb-5 backface-hidden"
        >
          {/* Category */}
          <span className="absolute top-0 left-0 w-full rounded-t-xl
                           py-1 pl-2 text-left text-xs font-bold text-white"
                           style={{ backgroundColor: color }}>
            {frontHeading}
          </span>

          {/* Question */}
          <p className="font-semibold leading-snug text-gray-900 text-sm md:text-base">{frontText}</p>

          {/* Flip Symbol */}
          <div className="absolute bottom-2 right-2 flex items-center justify-center w-6 h-6 rounded-full group-hover:rotate-180 transition-transform duration-300">
            <span className="text-xl text-gray-500">⟲</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl
                     p-5 text-center text-white
                     [transform:rotateY(180deg)] backface-hidden"
          style={{ backgroundColor: color }}
        >
          <p className="font-medium text-sm md:text-base">{backText}</p>
        </div>
      </div>
    </div>
  );
};


export default IntroFlashCard;
