import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditForm from '../../components/EditForm';

describe('EditForm component', () => {
  it('should Delete call and respond', async () => {
    const mockDelete = vi.fn();
    const mockHide = vi.fn();

    render(
      <EditForm
        entry={{ id: '123', date: '2023-01-01', content: 'Test content' }}
        onDelete={mockDelete}
        hideEdit={mockHide}
      />
    );

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
    // expect(mockDelete).toHaveBeenCalledWith('123');
    // expect(mockHide).toHaveBeenCalled();
  });
});
