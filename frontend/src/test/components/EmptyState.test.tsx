import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../../components/EmptyState';

describe('EmptyState', () => {
  it('renders the empty state message', () => {
    render(<EmptyState />);

    expect(screen.getByText('Start a conversation by sending a message below')).toBeInTheDocument();
  });

  it('renders with correct CSS class', () => {
    const { container } = render(<EmptyState />);

    const emptyStateDiv = container.querySelector('.empty-state');
    expect(emptyStateDiv).toBeInTheDocument();
  });

  it('renders a paragraph element', () => {
    const { container } = render(<EmptyState />);

    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Start a conversation by sending a message below');
  });
});
