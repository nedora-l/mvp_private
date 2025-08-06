import {
  sendMessage,
  getChatHistory,
  getAiToolsSettings,
  updateAiToolsSettings,
  deleteChatConversation,
  ChatMessage,
  ChatConversation,
  AiSettings,
} from './chat'; // Adjust path as necessary

jest.useFakeTimers();

describe('Chat API Mock', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on console.log to check for logging behavior
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.log
    consoleSpy.mockRestore();
    jest.clearAllTimers();
  });

  describe('sendMessage', () => {
    it('should simulate sending a message and return success with a messageId and sentMessage', async () => {
      const messageText = 'Hello, AI!';
      const conversationId = 'conv123';
      const promise = sendMessage(messageText, conversationId);

      // Expect console log for receiving message
      expect(consoleSpy).toHaveBeenCalledWith(`Mock API: Message received: "${messageText}" for conversation: ${conversationId}`);
      
      jest.advanceTimersByTime(1000); // Advance timer to resolve timeout

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.messageId).toMatch(/^msg_\d{13}_[a-z0-9]{7}$/);
      
      expect(result.sentMessage).toBeDefined();
      const sentMessage = result.sentMessage as ChatMessage;
      expect(sentMessage.text).toBe(messageText);
      expect(sentMessage.sender).toBe('user');
      expect(sentMessage.conversationId).toBe(conversationId);
      expect(sentMessage.timestamp).toBeInstanceOf(Date);
    });

    it('should create a new conversationId if not provided', async () => {
      const messageText = 'New conversation';
      const promise = sendMessage(messageText);
      
      expect(consoleSpy).toHaveBeenCalledWith(`Mock API: Message received: "${messageText}" for conversation: new`);

      jest.advanceTimersByTime(1000);
      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.sentMessage?.conversationId).toMatch(/^conv_\d{13}$/);
    });
  });

  describe('getChatHistory', () => {
    it('should simulate fetching chat history and return a list of conversations', async () => {
      const promise = getChatHistory();
      
      jest.advanceTimersByTime(700); // Advance timer

      const result = await promise;

      expect(result.history).toBeInstanceOf(Array);
      expect(result.history.length).toBeGreaterThan(0);
      const conversation = result.history[0] as ChatConversation;
      expect(conversation.id).toBeDefined();
      expect(conversation.title).toBeDefined();
      expect(conversation.lastMessageDate).toBeDefined();
      expect(new Date(conversation.lastMessageDate)).toBeInstanceOf(Date);
      expect(conversation.createdAt).toBeDefined();
      expect(new Date(conversation.createdAt)).toBeInstanceOf(Date);
      expect(consoleSpy).toHaveBeenCalledWith('Mock API: Fetched chat history.');
    });
  });

  describe('getAiToolsSettings', () => {
    it('should simulate fetching AI tool settings and return a settings object', async () => {
      const promise = getAiToolsSettings();

      jest.advanceTimersByTime(500); // Advance timer

      const result = await promise;

      expect(result.settings).toBeDefined();
      const settings = result.settings as AiSettings;
      expect(settings.model).toBeDefined();
      expect(typeof settings.temperature).toBe('number');
      expect(settings.apiKey).toBeDefined();
      expect(typeof settings.autoSuggest).toBe('boolean');
      expect(typeof settings.enableHistory).toBe('boolean');
      expect(typeof settings.maxTokens).toBe('number');
      expect(consoleSpy).toHaveBeenCalledWith('Mock API: Fetched AI tools settings.');
    });
  });

  describe('updateAiToolsSettings', () => {
    it('should simulate updating AI tool settings and return success with updated settings', async () => {
      const partialNewSettings: Partial<AiSettings> = {
        model: 'gpt-4-ultra',
        temperature: 0.9,
      };
      const promise = updateAiToolsSettings(partialNewSettings);
      
      expect(consoleSpy).toHaveBeenCalledWith('Mock API: Attempting to update AI tools settings with:', partialNewSettings);

      jest.advanceTimersByTime(700); // Advance timer

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.updatedSettings).toBeDefined();
      expect(result.updatedSettings.model).toBe(partialNewSettings.model);
      expect(result.updatedSettings.temperature).toBe(partialNewSettings.temperature);
      // Check that other settings are still there from the "original" mock settings
      expect(result.updatedSettings.apiKey).toBeDefined();
      expect(result.updatedSettings.maxTokens).toBe(2048);
      expect(consoleSpy).toHaveBeenCalledWith('Mock API: AI tools settings updated to:', result.updatedSettings);
    });
  });

  describe('deleteChatConversation', () => {
    it('should simulate deleting a chat conversation and return success', async () => {
      const conversationIdToDelete = 'conv_to_delete';
      const promise = deleteChatConversation(conversationIdToDelete);

      jest.advanceTimersByTime(500); // Advance timer

      const result = await promise;

      expect(result.success).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(`Mock API: Deleted chat conversation with ID: ${conversationIdToDelete}`);
    });
  });
});
