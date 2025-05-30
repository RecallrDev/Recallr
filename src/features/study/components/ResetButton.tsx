import React from 'react';
import { RotateCcw } from 'lucide-react';

type ResetButtonProps = {
  onReset: () => void;
  color?: string;
};

const ResetButton: React.FC<ResetButtonProps> = ({ onReset, color }) => {
  return (
    <button
      onClick={onReset}
      title="Reset Study Session"
      className="text-gray-600 hover:-rotate-360 transition-all duration-300 hover:scale-105 transform"
      style={{
        "--hover-color": color || "#8b5cf6"
      } as React.CSSProperties}
      onMouseEnter={(e) => e.currentTarget.style.color = color || "#8b5cf6"}
      onMouseLeave={(e) => e.currentTarget.style.color = ""}
    >
      <RotateCcw size={20} />
    </button>
  );
};

export default ResetButton;