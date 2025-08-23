import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddWorkoutForm from '../components/AddWorkoutForm';
import * as api from '../utils/api';

jest.mock('../utils/api');

describe('AddWorkoutForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const fillAndSubmit = async (data = {}) => {
    const defaults = {
      type: 'Running',
      duration: '45',
      caloriesBurned: '300',
      date: '2023-05-15',
      notes: 'Morning run',
    };
    const vals = { ...defaults, ...data };
    fireEvent.change(screen.getByTestId('type-input'), { target: { value: vals.type } });
    fireEvent.change(screen.getByTestId('duration-input'), { target: { value: vals.duration } });
    fireEvent.change(screen.getByTestId('caloriesBurned-input'), { target: { value: vals.caloriesBurned } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: vals.date } });
    fireEvent.change(screen.getByTestId('notes-input'), { target: { value: vals.notes } });
    fireEvent.click(screen.getByTestId('add-button'));
  };

  test('Form_ renders all fields and submit button', () => {
    render(<AddWorkoutForm />);
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/calories burned/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  test('ErrorHandling_ validates empty fields and shows error', async () => {
    render(<AddWorkoutForm />);
    fireEvent.click(screen.getByTestId('add-button'));
    await waitFor(() => {
      expect(screen.getByText(/type must not be empty/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/duration must be greater than 0/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/calories burned must be greater than or equal to 0/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/date must not be null/i)).toBeInTheDocument();
    });
  });

  test('ErrorHandling_ prevents future date and shows error', async () => {
    render(<AddWorkoutForm />);
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000 * 2).toISOString().slice(0, 10);
    await fillAndSubmit({ date: futureDate });
    await waitFor(() => {
      expect(screen.getByText(/date must not be a future date/i)).toBeInTheDocument();
    });
  });

  test('Form_ submits valid data, shows success and resets form', async () => {
    api.createWorkout.mockResolvedValueOnce({});
    render(<AddWorkoutForm onWorkoutAdded={jest.fn()} />);
    await fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByText(/workout added successfully/i)).toBeInTheDocument();
    });
    // Each waitFor with a single assertion to avoid 'multiple assertions' lint error
    await waitFor(() => {
      expect(screen.getByTestId('type-input').value).toBe('');
    });
    await waitFor(() => {
      expect(screen.getByTestId('duration-input').value).toBe('');
    });
    await waitFor(() => {
      expect(screen.getByTestId('caloriesBurned-input').value).toBe('');
    });
    await waitFor(() => {
      expect(screen.getByTestId('date-input').value).toBe('');
    });
    await waitFor(() => {
      expect(screen.getByTestId('notes-input').value).toBe('');
    });
  });

  test('Axios_ shows backend error summary and field errors', async () => {
    // Simulate API validation error response
    api.createWorkout.mockRejectedValueOnce({ message: 'Validation failed', errors: { type: 'Type must not be empty', duration: 'Err', caloriesBurned: 'Err', date: 'Err' }});
    render(<AddWorkoutForm />);
    await fillAndSubmit({ type: '', duration: '', caloriesBurned: '', date: '' });
    // Split into multiple waitFor blocks for single assertion each
    await waitFor(() => {
      const errorNode = screen.queryByTestId('form-error');
      expect(errorNode).not.toBeNull();
    });
    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('form-error').textContent).toContain('Validation failed');
    });
    await waitFor(() => {
      expect(screen.getByText('Type must not be empty')).toBeInTheDocument();
    });
  });
});
