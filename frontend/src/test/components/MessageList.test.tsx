import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageList } from '../../components/MessageList';
import { Message } from '../../types/message';

describe('MessageList', () => {
  const createMockMessage = (
    id: string,
    role: 'user' | 'assistant',
    content: string,
    timestamp: Date = new Date()
  ): Message => ({
    id,
    modelMessage: {
      role,
      content,
    },
    timestamp,
  });

  it('renders EmptyState when messages array is empty', () => {
    render(<MessageList messages={[]} />);

    expect(screen.getByText('Start a conversation by sending a message below')).toBeInTheDocument();
  });

  it('renders user message correctly', () => {
    const messages = [createMockMessage('1', 'user', 'Hello, how are you?')];

    render(<MessageList messages={messages} />);

    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    expect(screen.getByText(/User/)).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    const messages = [createMockMessage('1', 'assistant', 'I am doing well, thank you!')];

    render(<MessageList messages={messages} />);

    expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument();
    expect(screen.getByText(/Assistant/)).toBeInTheDocument();
  });

  it('renders multiple messages in order', () => {
    const messages = [
      createMockMessage('1', 'user', 'First message'),
      createMockMessage('2', 'assistant', 'Second message'),
      createMockMessage('3', 'user', 'Third message'),
    ];

    render(<MessageList messages={messages} />);

    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.getByText('Third message')).toBeInTheDocument();
  });

  it('applies correct CSS class for user messages', () => {
    const messages = [createMockMessage('1', 'user', 'User message')];

    const { container } = render(<MessageList messages={messages} />);

    const messageDiv = container.querySelector('.message-user');
    expect(messageDiv).toBeInTheDocument();
  });

  it('applies correct CSS class for assistant messages', () => {
    const messages = [createMockMessage('1', 'assistant', 'Assistant message')];

    const { container } = render(<MessageList messages={messages} />);

    const messageDiv = container.querySelector('.message-assistant');
    expect(messageDiv).toBeInTheDocument();
  });

  it('renders timestamp for each message', () => {
    const timestamp = new Date('2024-01-01T12:00:00');
    const messages = [createMockMessage('1', 'user', 'Test message', timestamp)];

    render(<MessageList messages={messages} />);

    expect(screen.getByText(timestamp.toLocaleTimeString())).toBeInTheDocument();
  });

  it('renders unique keys for each message', () => {
    const messages = [
      createMockMessage('msg-1', 'user', 'First'),
      createMockMessage('msg-2', 'assistant', 'Second'),
    ];

    const { container } = render(<MessageList messages={messages} />);

    const messageElements = container.querySelectorAll('.message');
    expect(messageElements.length).toBe(2);
  });

  it('scrolls to bottom when messages are rendered', () => {
    const messages = [createMockMessage('1', 'user', 'Test message')];

    const scrollIntoViewMock = vi.fn();
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(<MessageList messages={messages} />);

    expect(scrollIntoViewMock).toHaveBeenCalled();

    // Restore original
    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  it('renders conversation with alternating user and assistant messages', () => {
    const messages = [
      createMockMessage('1', 'user', 'What is the weather?'),
      createMockMessage('2', 'assistant', 'Let me check that for you.'),
      createMockMessage('3', 'user', 'Thank you!'),
      createMockMessage('4', 'assistant', 'You are welcome!'),
    ];

    const { container } = render(<MessageList messages={messages} />);

    const userMessages = container.querySelectorAll('.message-user');
    const assistantMessages = container.querySelectorAll('.message-assistant');

    expect(userMessages.length).toBe(2);
    expect(assistantMessages.length).toBe(2);
  });

  it('renders message content as string', () => {
    const messages = [createMockMessage('1', 'user', 'Content with special chars: <>&"')];

    render(<MessageList messages={messages} />);

    expect(screen.getByText('Content with special chars: <>&"')).toBeInTheDocument();
  });
});
