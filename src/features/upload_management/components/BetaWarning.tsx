import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { BetaWarningProps } from '../types/upload';

export const BetaWarning: React.FC<BetaWarningProps> = ({ className = '' }) => {
  return (
    <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
        <div>
          <p className="text-yellow-800 font-medium">Beta Version</p>
          <p className="text-yellow-700 text-sm mt-1">
            This is a beta version of the Upload Feature. Currently only .apkg's are supported.
          </p>
        </div>
      </div>
    </div>
  );
}; 