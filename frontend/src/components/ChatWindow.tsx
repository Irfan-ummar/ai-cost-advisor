'use client';

import { useRef, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import ChatBubble from './ChatBubble';
import InputBar from './InputBar';
import CreditBanner from './CreditBanner';
import ExamplePrompts from './ExamplePrompts';
import { Bot, Wifi, WifiOff } from 'lucide-react';

export default function ChatWindow() {
  const {
    messages,
    isConnected,
    isTyping,
    currentResponse,
    creditWarning,
    creditsExhausted,
    sendMessage,
    dismissCreditWarning,
  } = useWebSocket();

  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, currentResponse]);

  const handleExamplePromptSelect = (prompt: string) => {
    sendMessage(prompt);
  };

  const showExamplePrompts = messages.length === 0 && !isTyping;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Enterprise AI Cost Optimizer</h1>
                <p className="text-sm text-gray-600">Get AI cost optimization insights in seconds</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Credit Warning Banner */}
      {creditWarning && (
        <CreditBanner
          type="warning"
          message="Warning: AI credits are running low. You may not be able to send new prompts."
          onDismiss={dismissCreditWarning}
        />
      )}

      {creditsExhausted && (
        <CreditBanner
          type="error"
          message="Credits exhausted. Unable to process new prompts."
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Example Prompts - shown when chat is empty */}
        {showExamplePrompts && (
          <div className="pt-8">
            <ExamplePrompts 
              onPromptSelect={handleExamplePromptSelect}
              isVisible={showExamplePrompts}
            />
          </div>
        )}

        {/* Chat Area */}
        <div
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6"
        >
          {messages.length === 0 && !isTyping && !showExamplePrompts && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to CostOptimizer AI
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get personalized AI cost optimization strategies for your business
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* Typing indicator with current response */}
          {isTyping && (
            <ChatBubble
              message={{
                id: 'typing',
                role: 'agent',
                text: currentResponse || 'Analyzing your request...',
                timestamp: new Date(),
              }}
              isTyping={true}
            />
          )}
        </div>

        {/* Enhanced Input Bar */}
        <div className="p-4 md:p-6">
          <InputBar
            onSendMessage={sendMessage}
            disabled={!isConnected || creditsExhausted}
            isTyping={isTyping}
          />
          
          {/* Status text */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              {isTyping 
                ? "Generating detailed cost optimization analysis..." 
                : "Type your question or click an example above"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 