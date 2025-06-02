'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage, ChatState } from '@/types/chat';

export const useWebSocket = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    isTyping: false,
    currentResponse: '',
    creditWarning: false,
    creditsExhausted: false,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 3;

  const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
    switch (data.type) {
      case 'AI_TOKEN':
        setChatState(prev => ({
          ...prev,
          currentResponse: prev.currentResponse + (data.text || ''),
          isTyping: true,
        }));
        break;

      case 'AI_DONE':
        setChatState(prev => {
          const newMessage = {
            id: Date.now().toString(),
            role: 'agent' as const,
            text: prev.currentResponse,
            timestamp: new Date(),
            sections: parseDeckSections(prev.currentResponse),
          };

          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            currentResponse: '',
            isTyping: false,
          };
        });
        break;

      case 'ERROR':
        setChatState(prev => {
          const errorMessage = {
            id: Date.now().toString(),
            role: 'agent' as const,
            text: `Error: ${data.message || 'An error occurred'}`,
            timestamp: new Date(),
          };

          return {
            ...prev,
            messages: [...prev.messages, errorMessage],
            currentResponse: '',
            isTyping: false,
          };
        });
        break;

      case 'CREDIT_WARNING':
        setChatState(prev => ({ ...prev, creditWarning: true }));
        break;

      case 'CREDITS_EXHAUSTED':
        setChatState(prev => ({ ...prev, creditsExhausted: true }));
        break;

      default:
        console.warn('Unknown message type:', data.type);
    }
  }, []);

  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = `wss://${process.env.NEXT_PUBLIC_WS_HOST }/ws/chat/`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;


      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setChatState(prev => ({ ...prev, isConnected: true }));
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setChatState(prev => ({ ...prev, isConnected: false, isTyping: false }));
        
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... Attempt ${reconnectAttemptsRef.current}`);
            connect();
          }, 2000);
        } else {
          console.error('Max reconnection attempts reached');
          // Show modal or notification to user
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }, [handleWebSocketMessage]);

  const parseDeckSections = (text: string) => {
    console.log('Parsing deck sections from text:', text.substring(0, 200) + '...');
    
    // Clean up the text and extract the actual response content
    let cleanText = text;
    
    // Handle case where response is a JSON string with nested structure
    if (text.includes('"response":') && text.includes('module_outputs')) {
      try {
        // Try to extract just the main response text, ignoring metadata
        const responseMatch = text.match(/"response":\s*"([^"]+)"/);
        if (responseMatch) {
          cleanText = responseMatch[1];
          // Unescape JSON escaped characters
          cleanText = cleanText.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
      } catch {
        console.log('Error parsing JSON response, using original text');
      }
    }
    
    // Handle case where it's a direct JSON object
    if (cleanText.startsWith('{') && cleanText.includes('"response":')) {
      try {
        const parsed = JSON.parse(cleanText);
        if (parsed.response) {
          cleanText = parsed.response;
        }
      } catch {
        console.log('Not valid JSON format, proceeding with original text');
      }
    }

    const sections: { heading: string; body: string }[] = [];
    
    // First, look for the main numbered sections starting with ## 0. or 0.
    const numberedSectionRegex = /(?:^|\n)(?:##\s*)?(\d+)\.\s+([^\n]+)/g;
    const matches = Array.from(cleanText.matchAll(numberedSectionRegex));
    
    console.log(`Found ${matches.length} numbered sections`);
    
    if (matches.length >= 2) {
      // Find the start of the first numbered section
      const firstSectionIndex = matches[0].index || 0;
      const introText = cleanText.substring(0, firstSectionIndex).trim();
      
      // Look for Executive Snapshot in the intro text
      const execSnapshotMatch = introText.match(/\*\*Executive Snapshot\*\*\s*([\s\S]*?)(?=##|\n\n|\z)/i);
      
      if (execSnapshotMatch) {
        // Add Executive Snapshot as the first section
        sections.push({
          heading: "Executive Snapshot",
          body: execSnapshotMatch[1].trim()
        });
      } else if (introText && introText.length > 50) {
        // If no explicit Executive Snapshot found but there's substantial intro text
        // Check if it contains bullet points or other structured content
        if (introText.includes('•') || introText.includes('*') || introText.includes('AI optimizes')) {
          sections.push({
            heading: "Executive Snapshot", 
            body: introText
          });
        }
      }
      
      // Process numbered sections
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const sectionNumber = match[1];
        const sectionTitle = match[2].trim();
        
        // Extract body content between this section and the next
        const currentIndex = match.index || 0;
        const currentEnd = currentIndex + match[0].length;
        
        let bodyContent = '';
        if (i < matches.length - 1) {
          // Get content between current and next section
          const nextIndex = matches[i + 1].index || cleanText.length;
          bodyContent = cleanText.substring(currentEnd, nextIndex).trim();
        } else {
          // Last section, get everything remaining
          bodyContent = cleanText.substring(currentEnd).trim();
        }
        
        // Clean up the body content - remove any leading/trailing markdown or section markers
        bodyContent = bodyContent.replace(/^#+\s*/gm, '').trim();
        
        // Skip sections that are too short or seem like artifacts
        if (bodyContent.length < 10 && !bodyContent.includes('|') && !bodyContent.includes('•')) {
          continue;
        }
        
        sections.push({
          heading: `${sectionNumber}. ${sectionTitle}`,
          body: bodyContent || sectionTitle
        });
      }
    }

    console.log(`Final parsed sections (${sections.length}):`, sections.map(s => s.heading));
    
    // Only return sections if we have a meaningful number (at least 2)
    return sections.length >= 2 ? sections : undefined;
  };

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        text,
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isTyping: true,
        currentResponse: '',
      }));

      wsRef.current.send(JSON.stringify({
        type: 'USER_PROMPT',
        text,
      }));
    }
  }, []);

  const dismissCreditWarning = useCallback(() => {
    setChatState(prev => ({ ...prev, creditWarning: false }));
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    ...chatState,
    sendMessage,
    dismissCreditWarning,
  };
}; 