// lib/api/chat.ts

// --- Type Definitions ---

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  conversationId: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessageDate: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface AiSettings {
  model: string;
  temperature: number;
  apiKey: string; // Note: In a real app, never send the full API key to the client.
  autoSuggest: boolean;
  enableHistory: boolean;
  maxTokens: number;
}

// --- Mock API Functions ---

/**
 * Simulates sending a message to the chat API.
 * @param message The message text from the user.
 * @param conversationId Optional ID of the conversation to add the message to.
 * @returns A promise that resolves with a success status and a mock message ID.
 */
export const sendMessage = (
  message: string,
  conversationId?: string
): Promise<{ success: boolean; messageId?: string; sentMessage?: ChatMessage }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Mock API: Message received: "${message}" for conversation: ${conversationId || 'new'}`);
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newMessage: ChatMessage = {
        id: messageId,
        text: message,
        sender: 'user', // This would be the user sending the message
        timestamp: new Date(),
        conversationId: conversationId || `conv_${Date.now()}`
      };
      // In a real scenario, you might also get an AI response here.
      resolve({ success: true, messageId, sentMessage: newMessage });
    }, 500 + Math.random() * 500); // Simulate network delay
  });
};

/**
 * Simulates fetching the chat history.
 * @returns A promise that resolves with a list of mock chat conversations.
 */
export const getChatHistory = (): Promise<{ history: ChatConversation[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHistory: ChatConversation[] = [
        { id: 'conv1', title: 'Discussing Q3 Marketing Strategy', lastMessageDate: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'conv2', title: 'Project Phoenix - Next Steps', lastMessageDate: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
        { id: 'conv3', title: 'Follow up on client feedback', lastMessageDate: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
        { id: 'conv4', title: 'Brainstorming new feature ideas', lastMessageDate: new Date(Date.now() - 86400000 * 3).toISOString(), createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
      ];
      console.log('Mock API: Fetched chat history.');
      resolve({ history: mockHistory });
    }, 300 + Math.random() * 400);
  });
};

/**
 * Simulates fetching AI tool settings.
 * @returns A promise that resolves with a predefined AI settings object.
 */
export const getAiToolsSettings = (): Promise<{ settings: AiSettings }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSettings: AiSettings = {
        model: 'gpt-4-turbo',
        temperature: 0.7,
        apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx', // This is a mock key
        autoSuggest: true,
        enableHistory: true,
        maxTokens: 2048,
      };
      console.log('Mock API: Fetched AI tools settings.');
      resolve({ settings: mockSettings });
    }, 200 + Math.random() * 300);
  });
};

/**
 * Simulates updating AI tool settings.
 * @param newSettings The new settings object.
 * @returns A promise that resolves with a success status.
 */
export const updateAiToolsSettings = (newSettings: Partial<AiSettings>): Promise<{ success: boolean; updatedSettings: AiSettings }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In a real app, you'd merge with existing settings securely on the backend.
            // For this mock, we'll just log and assume success.
            console.log('Mock API: Attempting to update AI tools settings with:', newSettings);
            // Simulate potential validation or partial updates
            const currentSettings = { // Assume these are the "current" server-side settings
                model: 'gpt-4-turbo',
                temperature: 0.7,
                apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                autoSuggest: true,
                enableHistory: true,
                maxTokens: 2048,
            };
            const updatedSettings = { ...currentSettings, ...newSettings };
            console.log('Mock API: AI tools settings updated to:', updatedSettings);
            resolve({ success: true, updatedSettings });
        }, 400 + Math.random() * 300);
    });
};

/**
 * Simulates deleting a specific chat conversation.
 * @param conversationId The ID of the conversation to delete.
 * @returns A promise that resolves with a success status.
 */
export const deleteChatConversation = (conversationId: string): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Mock API: Deleted chat conversation with ID: ${conversationId}`);
            // In a real app, you would remove this from the backend data store.
            resolve({ success: true });
        }, 300 + Math.random() * 200);
    });
};
