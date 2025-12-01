import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatHeader } from '../../components/ChatHeader';

describe('ChatHeader', () => {
  it('renders the header with title', () => {
    const mockOnClearChat = vi.fn();
    render(<ChatHeader onClearChat={mockOnClearChat} />);

    expect(screen.getByRole('heading', { name: /weather chat/i })).toBeInTheDocument();
  });

  it('renders the clear chat button', () => {
    const mockOnClearChat = vi.fn();
    render(<ChatHeader onClearChat={mockOnClearChat} />);

    const clearButton = screen.getByRole('button', { name: /clear chat/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveAttribute('title', 'Clear chat');
  });

  it('calls onClearChat when clear button is clicked', async () => {
    const mockOnClearChat = vi.fn();
    const user = userEvent.setup();

    render(<ChatHeader onClearChat={mockOnClearChat} />);

    const clearButton = screen.getByRole('button', { name: /clear chat/i });
    await user.click(clearButton);

    expect(mockOnClearChat).toHaveBeenCalledTimes(1);
  });

  it('renders with the correct CSS class for clear button', () => {
    const mockOnClearChat = vi.fn();
    render(<ChatHeader onClearChat={mockOnClearChat} />);

    const clearButton = screen.getByRole('button', { name: /clear chat/i });
    expect(clearButton).toHaveClass('clear-chat-btn');
  });

  it('has accessible button title attribute', () => {
    const mockOnClearChat = vi.fn();
    render(<ChatHeader onClearChat={mockOnClearChat} />);

    const clearButton = screen.getByTitle('Clear chat');
    expect(clearButton).toBeInTheDocument();
  });

  it('multiple clicks trigger multiple calls to onClearChat', async () => {
    const mockOnClearChat = vi.fn();
    const user = userEvent.setup();

    render(<ChatHeader onClearChat={mockOnClearChat} />);

    const clearButton = screen.getByRole('button', { name: /clear chat/i });
    await user.click(clearButton);
    await user.click(clearButton);
    await user.click(clearButton);

    expect(mockOnClearChat).toHaveBeenCalledTimes(3);
  });
});
