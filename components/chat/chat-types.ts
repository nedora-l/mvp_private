export interface ChatMessage {
  id: number | string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp?: Date;
}
