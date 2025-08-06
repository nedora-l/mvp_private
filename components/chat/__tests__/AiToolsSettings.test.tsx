import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AiToolsSettings from '../AiToolsSettings'; // Adjust path as necessary

// Mock dictionary for testing
const mockDictionary = {
  chat: {
    settings: {
      title: 'AI Tools Settings',
      description: 'Configure your AI assistant preferences and model parameters.',
      apiKeyLabel: 'API Key',
      apiKeyPlaceholder: 'Enter your API key',
      hideApiKeyLabel: 'Hide API key',
      showApiKeyLabel: 'Show API key',
      aiModelLabel: 'AI Model',
      selectModelPlaceholder: 'Select a model',
      modelGpt4Turbo: 'GPT-4 Turbo',
      modelGpt35Turbo: 'GPT-3.5 Turbo',
      modelClaude3Opus: 'Claude 3 Opus',
      modelClaude3Sonnet: 'Claude 3 Sonnet',
      modelGeminiPro: 'Gemini Pro',
      temperatureLabelPrefix: 'Temperature: ',
      temperatureTooltip: 'Controls randomness...',
      autoSuggestLabel: 'Enable Auto-Suggestions',
      autoSuggestDescription: 'Get AI-powered suggestions...',
      enableHistoryLabel: 'Enable Chat History',
      enableHistoryDescription: 'Save conversations...',
      contextManagementTitle: 'Context Management',
      dragDropText: 'Drag & drop files here or',
      uploadFilesButton: 'Upload Files',
      fileConstraints: 'Max file size: 5MB...',
      saveButton: 'Save Settings',
    },
  },
};

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const originalModule = jest.requireActual('lucide-react');
  return {
    ...originalModule,
    Settings: () => <svg data-testid="settings-icon" />,
    Eye: () => <svg data-testid="eye-icon" />,
    EyeOff: () => <svg data-testid="eye-off-icon" />,
    Info: () => <svg data-testid="info-icon" />,
    FileText: () => <svg data-testid="file-text-icon" />,
    UploadCloud: () => <svg data-testid="upload-cloud-icon" />,
  };
});

// Mock UI components that might be complex or unnecessary for these unit tests
jest.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, ...props }: { value: number[], onValueChange: (value: number[]) => void} ) => (
    <input
      type="range"
      data-testid="slider"
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      {...props}
    />
  ),
}));
jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));


describe('AiToolsSettings Component', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders all settings sections and controls', () => {
    render(<AiToolsSettings dictionary={mockDictionary} />);

    // Check Card Header
    expect(screen.getByText(mockDictionary.chat.settings.title)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.chat.settings.description)).toBeInTheDocument();

    // API Key
    expect(screen.getByLabelText(mockDictionary.chat.settings.apiKeyLabel)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockDictionary.chat.settings.apiKeyPlaceholder)).toBeInTheDocument();

    // AI Model
    expect(screen.getByLabelText(mockDictionary.chat.settings.aiModelLabel)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.chat.settings.selectModelPlaceholder)).toBeInTheDocument(); // SelectValue placeholder

    // Temperature
    expect(screen.getByLabelText(/Temperature: 0.7/i)).toBeInTheDocument(); // Initial value
    expect(screen.getByTestId('slider')).toBeInTheDocument();

    // Boolean Toggles
    expect(screen.getByLabelText(mockDictionary.chat.settings.autoSuggestLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.chat.settings.enableHistoryLabel)).toBeInTheDocument();

    // Context Management
    expect(screen.getByText(mockDictionary.chat.settings.contextManagementTitle)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.chat.settings.dragDropText)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mockDictionary.chat.settings.uploadFilesButton })).toBeInTheDocument();

    // Save Button
    expect(screen.getByRole('button', { name: mockDictionary.chat.settings.saveButton })).toBeInTheDocument();
  });

  it('updates API key input value and toggles visibility', () => {
    render(<AiToolsSettings dictionary={mockDictionary} />);
    const apiKeyInput = screen.getByLabelText(mockDictionary.chat.settings.apiKeyLabel) as HTMLInputElement;
    const toggleVisibilityButton = screen.getByLabelText(mockDictionary.chat.settings.showApiKeyLabel);

    // Initial type is password
    expect(apiKeyInput.type).toBe('password');
    fireEvent.change(apiKeyInput, { target: { value: 'new-api-key' } });
    expect(apiKeyInput.value).toBe('new-api-key');

    // Click to show API key
    fireEvent.click(toggleVisibilityButton);
    expect(apiKeyInput.type).toBe('text');
    expect(toggleVisibilityButton).toHaveAccessibleName(mockDictionary.chat.settings.hideApiKeyLabel);


    // Click to hide API key again
    fireEvent.click(toggleVisibilityButton);
    expect(apiKeyInput.type).toBe('password');
    expect(toggleVisibilityButton).toHaveAccessibleName(mockDictionary.chat.settings.showApiKeyLabel);
  });

  it('updates temperature slider value', () => {
    render(<AiToolsSettings dictionary={mockDictionary} />);
    const temperatureSlider = screen.getByTestId('slider');
    const temperatureLabel = screen.getByLabelText(/Temperature:/i);

    fireEvent.change(temperatureSlider, { target: { value: '0.9' } });
    expect(temperatureLabel.textContent).toBe(`${mockDictionary.chat.settings.temperatureLabelPrefix}0.9`);
  });

  it('toggles a switch value (Enable Auto-Suggestions)', () => {
    render(<AiToolsSettings dictionary={mockDictionary} />);
    // Switch role might depend on exact implementation, often 'checkbox'
    const autoSuggestSwitch = screen.getByLabelText(mockDictionary.chat.settings.autoSuggestLabel) as HTMLInputElement;
    
    expect(autoSuggestSwitch.checked).toBe(true); // Default value in component state
    fireEvent.click(autoSuggestSwitch);
    expect(autoSuggestSwitch.checked).toBe(false);
  });

  it('calls console.log with settings when save button is clicked', () => {
    render(<AiToolsSettings dictionary={mockDictionary} />);
    const saveButton = screen.getByRole('button', { name: mockDictionary.chat.settings.saveButton });
    
    // Modify some settings to check if they are logged
    const apiKeyInput = screen.getByLabelText(mockDictionary.chat.settings.apiKeyLabel) as HTMLInputElement;
    fireEvent.change(apiKeyInput, { target: { value: 'updated-key' } });
    
    const autoSuggestSwitch = screen.getByLabelText(mockDictionary.chat.settings.autoSuggestLabel) as HTMLInputElement;
    fireEvent.click(autoSuggestSwitch); // Toggle it from true to false

    fireEvent.click(saveButton);

    expect(consoleSpy).toHaveBeenCalledWith('Settings saved:', {
      apiKey: 'updated-key',
      temperature: 0.7, // Initial, not changed in this test path
      selectedModel: 'gpt-4-turbo', // Initial
      autoSuggest: false, // Was true, toggled to false
      enableHistory: true, // Initial
    });
  });
});
