export interface Message {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp: Date;
  sections?: DeckSection[];
}

export interface DeckSection {
  heading: string;
  body: string;
}

export interface WebSocketMessage {
  type: 'USER_PROMPT' | 'AI_TOKEN' | 'AI_DONE' | 'ERROR' | 'CREDIT_WARNING' | 'CREDITS_EXHAUSTED';
  text?: string;
  message?: string;
}

export interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isTyping: boolean;
  currentResponse: string;
  creditWarning: boolean;
  creditsExhausted: boolean;
} 