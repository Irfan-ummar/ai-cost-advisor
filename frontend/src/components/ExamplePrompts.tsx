'use client';

import { Sparkles, TrendingUp, DollarSign, Zap, Users, Target } from 'lucide-react';

interface ExamplePromptsProps {
  onPromptSelect: (prompt: string) => void;
  isVisible: boolean;
}

const examplePrompts = [
  {
    icon: DollarSign,
    category: "Cost Optimization",
    prompt: "We're a marketing agency; how can AI cut costs?",
    color: "bg-green-50 border-green-200 hover:bg-green-100 text-green-800"
  },
  {
    icon: TrendingUp,
    category: "ROI Analysis",
    prompt: "What's the ROI of implementing AI chatbots for customer service?",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800"
  },
  {
    icon: Zap,
    category: "Automation",
    prompt: "How can AI automate our content creation workflow?",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-800"
  },
  {
    icon: Users,
    category: "Team Efficiency",
    prompt: "What AI tools can help our team work more efficiently?",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-800"
  },
  {
    icon: Target,
    category: "Strategy",
    prompt: "Create an AI implementation strategy for our startup",
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-800"
  },
  {
    icon: Sparkles,
    category: "Innovation",
    prompt: "How can AI give us a competitive advantage in our industry?",
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-800"
  }
];

export default function ExamplePrompts({ onPromptSelect, isVisible }: ExamplePromptsProps) {
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Try these example prompts
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examplePrompts.map((example, index) => {
            const IconComponent = example.icon;
            return (
              <button
                key={index}
                onClick={() => onPromptSelect(example.prompt)}
                className={`group p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md text-left ${example.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-white/60">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium opacity-70 mb-1">
                      {example.category}
                    </div>
                    <div className="text-sm font-medium leading-relaxed">
                      {example.prompt}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Click any prompt above to get started, or type your own question
          </p>
        </div>
      </div>
    </div>
  );
} 