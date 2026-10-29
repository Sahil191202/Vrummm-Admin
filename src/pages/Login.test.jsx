import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form elements and learning project disclaimer', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Vrumm Learning System/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('updates form values when seeded role buttons are clicked', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const financeBtn = screen.getByRole('button', { name: /Finance finance@vrumm.dev/i });
    fireEvent.click(financeBtn);

    const emailInput = screen.getByLabelText(/Email address/i);
    expect(emailInput).toHaveValue('finance@vrumm.dev');
  });

  it('shows error message if submitted with empty credentials', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it('submits credentials and handles server error message gracefully', async () => {
    authService.login.mockRejectedValueOnce(new Error('Invalid email or password'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Invalid email or password/i)).toBeInTheDocument();
  });
});
