'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
}

export default function InputBar({ onSendMessage, disabled = false, isTyping = false }: InputBarProps) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() && !disabled && !isTyping) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isButtonDisabled = disabled || isTyping || !inputText.trim();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Chat disabled" : "Ask about AI cost optimization..."}
            disabled={disabled}
            rows={1}
            className={`w-full resize-none border-0 outline-none text-gray-900 placeholder-gray-500 bg-transparent text-base leading-6 max-h-32 ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            style={{ 
              minHeight: '24px',
              height: 'auto',
              overflow: 'hidden'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={isButtonDisabled}
          className={`flex-shrink-0 p-3 rounded-xl font-medium transition-all duration-200 transform ${
            isButtonDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
          }`}
        >
          {isTyping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Character count and shortcuts */}
      <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Press Enter to send, Shift + Enter for new line</span>
        </div>
        <div className="flex items-center gap-2">
          {inputText.length > 0 && (
            <span className={inputText.length > 1000 ? 'text-red-500' : ''}>
              {inputText.length}/1000
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 