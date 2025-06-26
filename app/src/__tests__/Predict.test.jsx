import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Predict from '../pages/Predict';
import * as usePredictHook from '../hooks/usePredict';

// Mock usePredict hook
jest.mock('../hooks/usePredict');

const fillForm = () => {
  fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Male' } });
  fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: 30 } });
  fireEvent.change(screen.getByLabelText(/Hypertension/i), { target: { value: 0 } });
  fireEvent.change(screen.getByLabelText(/Heart Disease/i), { target: { value: 0 } });
  fireEvent.change(screen.getByLabelText(/Smoking History/i), { target: { value: 'never' } });
  fireEvent.change(screen.getByLabelText(/BMI/i), { target: { value: 25 } });
  fireEvent.change(screen.getByLabelText(/HbA1c Level/i), { target: { value: 5.5 } });
  fireEvent.change(screen.getByLabelText(/Blood Glucose Level/i), { target: { value: 110 } });
};

describe('Predict page', () => {
  beforeEach(() => {
    usePredictHook.usePredict.mockReturnValue({
      loading: false,
      result: null,
      error: null,
      predict: jest.fn(),
      reset: jest.fn(),
    });
  });

  it('renders form fields and buttons', () => {
    render(<Predict />);
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Predict Risk/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    render(<Predict />);
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: 200 } });
    fireEvent.click(screen.getByRole('button', { name: /Predict Risk/i }));
    await waitFor(() => {
      expect(screen.getByText(/Age must be between 1 and 120/i)).toBeInTheDocument();
    });
  });

  it('shows loading indicator when loading', () => {
    usePredictHook.usePredict.mockReturnValueOnce({
      loading: true,
      result: null,
      error: null,
      predict: jest.fn(),
      reset: jest.fn(),
    });
    render(<Predict />);
    expect(screen.getByText(/Predicting.../i)).toBeInTheDocument();
  });

  it('shows result after prediction', async () => {
    usePredictHook.usePredict.mockReturnValueOnce({
      loading: false,
      result: { prediction: 1, probability: 0.92, confidence: 0.95 },
      error: null,
      predict: jest.fn(),
      reset: jest.fn(),
    });
    render(<Predict />);
    expect(screen.getByText(/High Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/92% probability/i)).toBeInTheDocument();
  });

  it('shows error toast on API error', async () => {
    usePredictHook.usePredict.mockReturnValueOnce({
      loading: false,
      result: null,
      error: 'Prediction failed',
      predict: jest.fn(),
      reset: jest.fn(),
    });
    render(<Predict />);
    expect(screen.getByText(/Prediction Error/i)).toBeInTheDocument();
  });

  it('resets form and results on Reset', () => {
    render(<Predict />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
    expect(screen.getByLabelText(/Gender/i).value).toBe('');
    expect(screen.queryByText(/High Risk/i)).not.toBeInTheDocument();
  });
});
