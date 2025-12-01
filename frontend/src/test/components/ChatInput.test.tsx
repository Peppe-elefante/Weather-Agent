import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../../components/ChatInput';

describe('ChatInput', () => {
  it('renders input field and send button', () => {
    const mockOnSendMessage = vi.fn();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello world');

    expect(input).toHaveValue('Hello world');
  });

  it('calls onSendMessage when send button is clicked', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await user.type(input, 'Test message');
    await user.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
  });

  it('clears input after sending message', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await user.type(input, 'Test message');
    await user.click(sendButton);

    expect(input).toHaveValue('');
  });

  it('sends message when Enter key is pressed', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');

    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('does not send message when Shift+Enter is pressed', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');

    await user.type(input, 'Test message');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('does not send empty or whitespace-only messages', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await user.type(input, '   ');
    await user.click(sendButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('disables input and button when isLoading is true', () => {
    const mockOnSendMessage = vi.fn();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Sending...' });

    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('shows "Sending..." text when isLoading is true', () => {
    const mockOnSendMessage = vi.fn();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Sending...' })).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    const mockOnSendMessage = vi.fn();
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when input has content', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await user.type(input, 'Hello');

    expect(sendButton).not.toBeDisabled();
  });

  it('does not send message when isLoading is true', async () => {
    const mockOnSendMessage = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);

    const input = screen.getByPlaceholderText('Type your message...');

    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
});
