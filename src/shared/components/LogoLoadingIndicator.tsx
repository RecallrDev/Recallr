import React from 'react';
import logo from '../../assets/logo.svg';

interface LogoLoadingIndicatorProps {
  loadingText?: string;
}

const LogoLoadingIndicator: React.FC<LogoLoadingIndicatorProps> = ({ 
  loadingText = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img 
            src={logo} 
            alt="Recallr Logo" 
            className="w-16 h-16 animate-[spin_1.2s_linear_infinite]"
          />
        </div>
        <p className="text-gray-600">{loadingText}</p>
      </div>
    </div>
  );
};

export default LogoLoadingIndicator;
