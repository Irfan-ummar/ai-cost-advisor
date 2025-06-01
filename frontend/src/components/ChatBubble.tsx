'use client';

import { Message } from '@/types/chat';
import DeckCard from './DeckCard';
import { User, Bot, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface ChatBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export default function ChatBubble({ message, isTyping = false }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-xs md:max-w-4xl ${isUser ? 'order-2' : 'order-1'} flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {/* User Bubble */}
          {isUser && (
            <div className="group relative">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-md">
                <p className="text-base font-medium leading-relaxed">{message.text}</p>
              </div>
              
              {/* Copy button for user messages */}
              <button
                onClick={() => copyToClipboard(message.text)}
                className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20 rounded"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          )}

          {/* Agent Bubble */}
          {!isUser && (
            <div className="group relative">
              <div className="bg-white rounded-2xl rounded-tl-md shadow-lg border border-gray-100">
                {isTyping && message.text === 'Analyzing your request...' ? (
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">Analyzing your request...</span>
                        <span className="text-xs text-gray-500">Generating detailed cost optimization analysis</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Show streaming text while typing */}
                    {isTyping && message.text && (
                      <div className="p-4">
                        <div className="space-y-4">
                          <p className="text-base whitespace-pre-wrap leading-relaxed text-gray-800">{message.text}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="animate-pulse text-indigo-500">●</div>
                            <span className="ml-2">Generating response...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show final message with deck cards if not typing */}
                    {!isTyping && (
                      <>
                        {message.sections && message.sections.length > 0 ? (
                          <div className="space-y-6 p-4">
                            {message.sections.map((section, index) => (
                              <DeckCard
                                key={index}
                                section={section}
                                index={index}
                                total={message.sections!.length}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className="text-base whitespace-pre-wrap leading-relaxed text-gray-800">{message.text}</p>
                          </div>
                        )}
                        
                        {/* Copy button for agent messages */}
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 rounded-lg"
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
} 