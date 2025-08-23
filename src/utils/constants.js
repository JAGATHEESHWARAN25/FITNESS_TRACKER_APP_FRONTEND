// constants.js

export const API_BASE_URL = 'http://localhost:8080/api/workouts';

export const DEFAULT_WORKOUT = {
  type: '',
  duration: '',
  caloriesBurned: '',
  date: '',
  notes: ''
};

export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidDate: 'Date must not be a future date'
};
