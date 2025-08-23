import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import WorkoutList from '../components/WorkoutList';
import * as api from '../utils/api';

// Mock api
jest.mock('../utils/api');

describe('WorkoutList', () => {
  afterEach(() => { jest.clearAllMocks(); });

  test('State_ shows loader, fetches and renders workouts', async () => {
    api.fetchAllWorkouts.mockResolvedValueOnce([
      {
        id: 1, type: 'Running', duration: 30, caloriesBurned: 300, date: '2023-05-15', notes: 'Run'
      },
      {
        id: 2, type: 'Cycling', duration: 45, caloriesBurned: 450, date: '2023-05-20', notes: 'Ride'
      }
    ]);
    render(<WorkoutList />);
    expect(screen.getByTestId('workout-list-loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Running')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Cycling')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2 data rows
    });
    await waitFor(() => {
      expect(screen.getByText('May 15, 2023')).toBeInTheDocument();
    });
  });

  test('Axios_ handles empty state', async () => {
    api.fetchAllWorkouts.mockResolvedValueOnce([]);
    render(<WorkoutList />);
    expect(screen.getByTestId('workout-list-loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('workout-list-empty')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId('workout-list-empty').textContent).toMatch(/no workouts/i);
    });
  });

  test('Axios_ handles API error', async () => {
    api.fetchAllWorkouts.mockRejectedValueOnce({ message: 'Network error' });
    render(<WorkoutList />);
    expect(screen.getByTestId('workout-list-loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('workout-list-error')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
