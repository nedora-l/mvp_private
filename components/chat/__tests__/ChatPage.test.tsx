import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatPage from '../ChatPage'; // Adjust path as necessary

// Mock dictionary for testing
const mockDictionary = {
  chat: {
    page: {
      input: {
        attachFileLabel: 'Attach file',
        placeholder: 'Type your message here...',
        micLabel: 'Use microphone',
        sendLabel: 'Send message',
      },
      settingsTitle: 'AI Tools Settings',
      modelLabel: 'Model:',
      temperatureLabel: 'Temperature:',
      temperatureDescription: 'Adjust creativity vs. coherence.',
      moreSettingsButton: 'More Settings',
      contextFilesLabel: 'Context Files:',
      uploadFileButton: 'Upload File',
      fileSizeLimit: 'Max 5MB per file.',
      mobileTitle: 'Chat',
    },
  },
};

// Mock lucide-react icons used in ChatPage and its ChatInput
jest.mock('lucide-react', () => {
  const originalModule = jest.requireActual('lucide-react');
  return {
    ...originalModule,
    Paperclip: () => <svg data-testid="paperclip-icon" />,
    Mic: () => <svg data-testid="mic-icon" />,
    Settings2: () => <svg data-testid="settings2-icon" />,
    SendHorizontal: () => <svg data-testid="send-horizontal-icon" />,
  };
});

// Mock ScrollArea to just render its children
jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>,
}));


describe('ChatPage Component', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders main sections correctly', () => {
    render(<ChatPage dictionary={mockDictionary} />);

    // Check for AI Tools Settings Sidebar (placeholder content)
    // Note: This sidebar is hidden on small screens by default.
    // RTL renders the DOM, CSS visibility is not directly testable without visual tools or specific setup.
    // We test for its presence in the DOM.
    expect(screen.getByText(mockDictionary.chat.page.settingsTitle)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.chat.page.modelLabel)).toBeInTheDocument();

    // Check for Message Display Area (initially with placeholder messages)
    expect(screen.getByText('Hello there!')).toBeInTheDocument(); // Mock message
    expect(screen.getByText('Hi! How are you?')).toBeInTheDocument(); // Mock message

    // Check for ChatInput area
    expect(screen.getByPlaceholderText(mockDictionary.chat.page.input.placeholder)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.chat.page.input.sendLabel)).toBeInTheDocument();
  });

  it('allows sending a message and updates the message list', () => {
    render(<ChatPage dictionary={mockDictionary} />);

    const inputElement = screen.getByPlaceholderText(mockDictionary.chat.page.input.placeholder) as HTMLInputElement;
    const sendButton = screen.getByLabelText(mockDictionary.chat.page.input.sendLabel);

    const newMessage = 'This is a test message!';
    fireEvent.change(inputElement, { target: { value: newMessage } });
    fireEvent.click(sendButton);

    // Check if the new message appears in the document
    expect(screen.getByText(newMessage)).toBeInTheDocument();
    // Check if console log for sending message was called
    expect(consoleSpy).toHaveBeenCalledWith('New message sent:', newMessage);
    // Check if input is cleared
    expect(inputElement.value).toBe('');
  });

  it('renders mobile header with title and settings button', () => {
    render(<ChatPage dictionary={mockDictionary} />);
    // These elements are styled with md:hidden, so they are present in DOM
    expect(screen.getByText(mockDictionary.chat.page.mobileTitle)).toBeInTheDocument();
    // The settings button on mobile is an icon button, its accessible name is "AI Tools Settings" (sr-only)
    expect(screen.getByRole('button', { name: mockDictionary.chat.page.settingsTitle })).toBeInTheDocument();
  });
});
