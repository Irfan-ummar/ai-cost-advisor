'use client';

import { DeckSection } from '@/types/chat';

interface DeckCardProps {
  section: DeckSection;
  index: number;
  total: number;
}

export default function DeckCard({ section, index, total }: DeckCardProps) {
  // Format the body content to handle different types of content
  const formatBodyContent = (content: string) => {
    // Handle code blocks (mermaid diagrams, architecture, etc.)
    if (content.includes('```')) {
      return content.split('```').map((part, i) => {
        if (i % 2 === 1) { // Odd indices are code blocks
          return (
            <pre key={i} className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4">
              <code>{part.trim()}</code>
            </pre>
          );
        } else {
          return <span key={i}>{part}</span>;
        }
      });
    }

    // Handle tables (simple markdown-style tables)
    if (content.includes('|') && content.includes('---')) {
      const lines = content.split('\n');
      const tableLines: string[] = [];
      const nonTableContent = [];
      let inTable = false;

      lines.forEach((line) => {
        if (line.includes('|') && line.trim() !== '') {
          inTable = true;
          tableLines.push(line);
        } else if (line.includes('---') && inTable) {
          // Skip separator line
        } else {
          if (inTable && tableLines.length > 0) {
            // End of table, process it
            nonTableContent.push(renderTable(tableLines));
            tableLines.length = 0;
            inTable = false;
          }
          if (line.trim() !== '') {
            nonTableContent.push(line);
          }
        }
      });

      // Handle remaining table if exists
      if (tableLines.length > 0) {
        nonTableContent.push(renderTable(tableLines));
      }

      return nonTableContent.map((item, i) => {
        if (typeof item === 'string') {
          return <p key={i} className="mb-2">{item}</p>;
        }
        return <div key={i} className="my-4">{item}</div>;
      });
    }

    // Handle bullet points
    const processedContent = content.replace(/^[-•]\s+/gm, '• ');
    
    return processedContent.split('\n').map((line, i) => {
      if (line.trim() === '') return null;
      
      const isListItem = line.trim().startsWith('•') || line.trim().startsWith('-');
      
      if (isListItem) {
        return (
          <li key={i} className="ml-4 mb-1 list-none">
            {line.replace(/^[-•]\s*/, '')}
          </li>
        );
      }
      
      return <p key={i} className="mb-2">{line}</p>;
    }).filter(Boolean);
  };

  const renderTable = (tableLines: string[]) => {
    const rows = tableLines.map(line => 
      line.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
    );

    if (rows.length === 0) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {rows[0].map((header, i) => (
                <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-sm text-gray-800 border-b">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto hover:shadow-md transition-all duration-300">
      {/* Card Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
            {section.heading}
          </h3>
          {total > 1 && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {index + 1} of {total}
            </div>
          )}
        </div>
        
        {total > 1 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="mb-6">
        <div className="text-base text-gray-800 leading-relaxed space-y-3">
          {formatBodyContent(section.body.trim())}
        </div>
      </div>

      {/* Navigation */}
      {total > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === index 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 scale-125' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {index > 0 && (
              <span className="flex items-center gap-1">
                ← Previous
              </span>
            )}
            {index < total - 1 && (
              <span className="flex items-center gap-1">
                Next →
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 