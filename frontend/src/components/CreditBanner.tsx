'use client';

import { AlertTriangle, X, AlertCircle } from 'lucide-react';

interface CreditBannerProps {
  type: 'warning' | 'error';
  message: string;
  onDismiss?: () => void;
}

export default function CreditBanner({ type, message, onDismiss }: CreditBannerProps) {
  const isWarning = type === 'warning';
  
  return (
    <div className={`relative px-4 py-3 ${
      isWarning 
        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200' 
        : 'bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-full ${
            isWarning ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {isWarning ? (
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
          
          <div>
            <p className={`text-sm font-medium ${
              isWarning ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {isWarning ? 'Credit Warning' : 'Credits Exhausted'}
            </p>
            <p className={`text-xs ${
              isWarning ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {message}
            </p>
          </div>
        </div>
        
        {onDismiss && isWarning && (
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-full hover:bg-yellow-100 transition-colors"
          >
            <X className="w-4 h-4 text-yellow-600" />
          </button>
        )}
      </div>
    </div>
  );
} 