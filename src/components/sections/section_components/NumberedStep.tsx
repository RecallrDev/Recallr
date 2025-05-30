import React from "react";

export type NumberedStepProps = {
  number: number;
  title: string;
  description: string;
};

const NumberedStep: React.FC<NumberedStepProps> = ({ number, title, description }) => {
  return (
            <div className="p-6 text-center">
                <span className="
                        w-12 h-12
                        mx-auto mb-3 
                        flex items-center justify-center
                        text-xl font-bold
                         text-purple-800
                         bg-purple-100
                        rounded-full">
                    {number}
                </span>

                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-gray-600">
                    {description}
                </p>
                </div>
  );
};

export default NumberedStep;
