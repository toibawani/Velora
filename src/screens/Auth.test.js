import { fireEvent, render, screen } from '@testing-library/react';
import Register from './Register';

describe('registration form experience', () => {
  test('waits for blur before correcting an incomplete field', () => {
    render(<Register setScreen={jest.fn()} onRegister={jest.fn()} showToast={jest.fn()} />);

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'toibawani' } });

    expect(screen.queryByText(/enter a valid email address/i)).not.toBeInTheDocument();

    fireEvent.blur(emailInput);

    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('treats account navigation as a secondary button action', () => {
    const setScreen = jest.fn();
    render(<Register setScreen={setScreen} onRegister={jest.fn()} showToast={jest.fn()} />);

    const signInButton = screen.getByRole('button', { name: /already have an account/i });
    expect(signInButton).toHaveAttribute('type', 'button');
    fireEvent.click(signInButton);

    expect(setScreen).toHaveBeenCalledWith('login');
  });
});