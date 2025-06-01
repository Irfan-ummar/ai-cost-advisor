'use client';

import { useState } from 'react';
import DeckCard from './DeckCard';
import { DeckSection } from '@/types/chat';

// Sample AI response for testing deck functionality - updated to match actual response format
const sampleResponse = `Session metadata details are not necessary for our planning. Instead, here's a comprehensive plan tailored to integrate AI agents into your marketing agency to enhance efficiency and cut costs.

Client System-->Marketing AI Agent: Request for insights
Marketing AI Agent-->RAG System: Query data
RAG System-->Marketing AI Agent: Retrieve information
Marketing AI Agent-->Client System: Deliver insights

## 4. Build Brief • Model & Pattern – GPT-4.1-mini, RAG • Infra & Hosting – AWS Bedrock Lambda • Data & Tools – Postgres, Pinecone ## 5. Agent-Level Orchestration

1. Query data insights using a RAG pipeline.

2. Use energy-efficient AI models to reduce costs.

3. Dynamic prompt generation for optimal results.

## 6. Org-Wide Automation Map

Task                    AI Solution              Cost Reduction
---------              -----------------        ---------------
Data Entry             Automation Tools         20%
Report Gen.            Natural Lang. Gen.       30%
Customer Int.          Chatbots                 60%

## 7. Credit / $ Cost Breakdown

Description                                      Daily Cost
--------------------                             -----------
LLM Usage                                        $300

## 8. LLM Call Count & Token Footprint

Total calls/day: 500; input: 10,000, output: 15,000 tokens. Main cost drivers: LLM calls, embeddings, long prompts.

## 9. Model Choice Table

Model          $/1K IN       $/1K OUT       Latency
GPT-4.1-mini   0.002         0.008          0.40 s
Nova-1         0.001         0.003          0.25 s

Nova-1 is cheapest hosted; Llama-3-8B-self enables on-prem privacy.

## 10. Research-Backed Recommendations

Patch efficiency gains by compressing prompts (~25 % fewer tokens) and caching repeat queries (~12% saves).

## 11. Sources

Source                             Key Takeaway                                    URL
------------------------------     ------------------------------------------------ ----------------------------
McKinsey 2025 02                   AI cuts 25–35 % OPEX in property mgmt         https://mock.mckinsey.com`;

// Function to parse deck sections (matching the one in useWebSocket)
const parseDeckSections = (text: string) => {
  const sections = [];
  
  // Look for numbered sections with ## format
  const sectionRegex = /##\s*(\d+)\.\s+([^\n]+)(?:\n((?:(?!##\s*\d+\.).)*?))?/g;
  const matches = Array.from(text.matchAll(sectionRegex));
  
  if (matches.length === 0) {
    return undefined;
  }
  
  // Find where the first section starts
  const firstMatch = matches[0];
  const firstSectionIndex = firstMatch.index || 0;
  const introText = text.substring(0, firstSectionIndex).trim();
  
  // If there's intro text, add it as the first section
  if (introText && introText.length > 50) {
    sections.push({
      heading: "Executive Summary",
      body: introText
    });
  }
  
  // Process numbered sections
  matches.forEach((match, index) => {
    const sectionNumber = match[1];
    const sectionTitle = match[2].trim();
    let bodyContent = match[3] ? match[3].trim() : '';
    
    // If no body content found, try to extract it between sections
    if (!bodyContent && index < matches.length - 1) {
      const currentEnd = (match.index || 0) + match[0].length;
      const nextStart = matches[index + 1].index || text.length;
      const betweenText = text.substring(currentEnd, nextStart).trim();
      if (betweenText) {
        bodyContent = betweenText;
      }
    } else if (!bodyContent && index === matches.length - 1) {
      // Last section, take everything after this match
      const currentEnd = (match.index || 0) + match[0].length;
      const remaining = text.substring(currentEnd).trim();
      if (remaining) {
        bodyContent = remaining;
      }
    }
    
    sections.push({
      heading: `${sectionNumber}. ${sectionTitle}`,
      body: bodyContent || sectionTitle
    });
  });

  return sections.length > 0 ? sections : undefined;
};

export default function TestDeckDemo() {
  const [showDemo, setShowDemo] = useState(false);
  
  const sections = parseDeckSections(sampleResponse);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Deck Cards Demo
        </h1>
        <p className="text-gray-600 mb-4">
          This demonstrates how AI responses with numbered sections are rendered as deck-style cards.
        </p>
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showDemo ? 'Hide Demo' : 'Show Deck Cards Demo'}
        </button>
      </div>

      {showDemo && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-2">Sample AI Response:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {sampleResponse.substring(0, 200)}...
            </pre>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Rendered as Deck Cards:
            </h3>
            
            {sections && sections.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <DeckCard
                      key={index}
                      section={section}
                      index={index}
                      total={sections.length}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 p-4 border border-gray-300 rounded-lg">
                No sections detected. Response would be shown as regular text.
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>1. AI response is parsed for numbered sections (## 0. Title format)</li>
              <li>2. Each section becomes a separate card with heading and body</li>
              <li>3. Cards are stacked vertically with navigation indicators</li>
              <li>4. If no numbered sections found, shows as regular text</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 