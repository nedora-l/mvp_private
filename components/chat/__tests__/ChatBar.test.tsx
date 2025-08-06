import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBar from '../ChatBar'; // Adjust path as necessary

// Mock dictionary for testing
const mockDictionary = {
  chat: {
    bar: {
      openChatLabel: 'Open chat',
      title: 'Chat',
      closeChatLabel: 'Close chat',
      messagePlaceholder: 'Type a message...',
      sendButton: 'Send',
      openFullChatButton: 'Open Full Chat',
    },
  },
};

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const originalModule = jest.requireActual('lucide-react');
  return {
    ...originalModule,
    MessageSquare: () => <svg data-testid="message-square-icon" />,
    X: () => <svg data-testid="x-icon" />,
  };
});

describe('ChatBar Component', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders the FAB by default on smaller screens (simulated by state)', () => {
    render(<ChatBar dictionary={mockDictionary} />);
    // Initially, isChatOpen is false, so FAB should be visible
    expect(screen.getByLabelText(mockDictionary.chat.bar.openChatLabel)).toBeInTheDocument();
    expect(screen.getByTestId('message-square-icon')).toBeInTheDocument();
  });

  it('expands to the full chat input when FAB is clicked', () => {
    render(<ChatBar dictionary={mockDictionary} />);
    
    // Click the FAB to open the chat input view
    fireEvent.click(screen.getByLabelText(mockDictionary.chat.bar.openChatLabel));

    // Now the expanded view should be visible
    expect(screen.getByText(mockDictionary.chat.bar.title)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockDictionary.chat.bar.messagePlaceholder)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mockDictionary.chat.bar.sendButton })).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.chat.bar.closeChatLabel)).toBeInTheDocument(); // Close button
  });

  it('allows typing in the input field', () => {
    render(<ChatBar dictionary={mockDictionary} />);
    fireEvent.click(screen.getByLabelText(mockDictionary.chat.bar.openChatLabel)); // Open chat

    const inputElement = screen.getByPlaceholderText(mockDictionary.chat.bar.messagePlaceholder) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'Hello test' } });
    expect(inputElement.value).toBe('Hello test');
  });

  it('submits the message and clears input when send button is clicked', () => {
    render(<ChatBar dictionary={mockDictionary} />);
    fireEvent.click(screen.getByLabelText(mockDictionary.chat.bar.openChatLabel)); // Open chat

    const inputElement = screen.getByPlaceholderText(mockDictionary.chat.bar.messagePlaceholder) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: mockDictionary.chat.bar.sendButton });

    fireEvent.change(inputElement, { target: { value: 'Test submission' } });
    fireEvent.click(sendButton);

    expect(consoleSpy).toHaveBeenCalledWith('Message submitted:', 'Test submission');
    expect(inputElement.value).toBe(''); // Input should be cleared
  });

  it('closes the expanded view when close button is clicked', () => {
    render(<ChatBar dictionary={mockDictionary} />);
    fireEvent.click(screen.getByLabelText(mockDictionary.chat.bar.openChatLabel)); // Open chat

    // Ensure expanded view is open
    expect(screen.getByText(mockDictionary.chat.bar.title)).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByLabelText(mockDictionary.chat.bar.closeChatLabel);
    fireEvent.click(closeButton);

    // Now FAB should be visible again
    expect(screen.getByLabelText(mockDictionary.chat.bar.openChatLabel)).toBeInTheDocument();
    expect(screen.queryByText(mockDictionary.chat.bar.title)).not.toBeInTheDocument(); // Expanded view title should be gone
  });
  
  // Note: Testing the md:hidden and hidden md:flex directly for responsive views
  // is better done with visual regression or E2E tests.
  // Here, we mostly test the logic based on isChatOpen state.
  // The desktop view specific elements can be checked if we assume a larger screen context.
  // For simplicity, the above tests focus on the mobile FAB-to-expanded-view flow.

  it('renders desktop fixed bar elements (conceptual test - assuming desktop context)', () => {
    // This test is more conceptual for RTL as it doesn't control viewport size easily.
    // We are checking if the elements for desktop are part of the render output,
    // their visibility is controlled by Tailwind classes.
    render(<ChatBar dictionary={mockDictionary} />);
    
    // Elements specific to the desktop view (these are always rendered but hidden/shown by CSS)
    expect(screen.getByText(mockDictionary.chat.bar.openFullChatButton)).toBeInTheDocument();
    // The input and send button are also present in the desktop form.
    // To avoid ambiguity with mobile form elements (if chat is open),
    // one might need more specific selectors or test IDs if testing desktop view specifically.
  });
});
