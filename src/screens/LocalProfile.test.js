import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import LocalProfile from './LocalProfile';
import { getProfile, saveProfile, clearProfile } from '../utils/localProfile';

beforeEach(() => {
  window.localStorage.clear();
});

describe('local profile storage', () => {
  test('stores and reads back a name', () => {
    saveProfile('Ada');
    expect(getProfile()).toMatchObject({ name: 'Ada' });
  });

  test('asks for no email, phone, username or password', () => {
    // These fields were collected by the version this replaced and read by no
    // code in this app. They must not come back.
    saveProfile('Ada');
    const raw = window.localStorage.getItem('velora_local_profile');
    expect(raw).not.toMatch(/email|phone|password|username/i);
  });

  test('reports a refused write instead of pretending it saved', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(saveProfile('Ada')).toBeNull();
    setItem.mockRestore();
  });

  test('reads a corrupted value as no profile rather than crashing', () => {
    window.localStorage.setItem('velora_local_profile', '{not-json');
    expect(getProfile()).toBeNull();
  });

  test('clears on request', () => {
    saveProfile('Ada');
    clearProfile();
    expect(getProfile()).toBeNull();
  });
});

describe('local profile screen', () => {
  test('has no detectable axe violations on the first step', async () => {
    const { container } = render(<LocalProfile setScreen={jest.fn()} onStart={jest.fn()} showToast={jest.fn()} />);
    expect((await axe(container)).violations).toEqual([]);
  });

  test('states what is stored here and when it can leave', () => {
    render(<LocalProfile setScreen={jest.fn()} onStart={jest.fn()} showToast={jest.fn()} />);
    // The screen asks for a name and never for an email or a password. It cannot
    // say "no account" any more: an account exists, it is just somewhere else.
    expect(screen.getByText(/no email and no password/i)).toBeInTheDocument();
    expect(screen.queryByText(/no account/i)).not.toBeInTheDocument();
    // The old sentence was "never transmitted anywhere", which stopped being
    // true when sync arrived. The claim now names the condition.
    expect(screen.getByText(/unless you sign in from Settings/i)).toBeInTheDocument();
  });

  test('waits for blur before correcting a too-short name', () => {
    const onStart = jest.fn();
    render(<LocalProfile setScreen={jest.fn()} onStart={onStart} showToast={jest.fn()} />);
    const input = screen.getByLabelText('Display name');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(screen.queryByText(/at least 2 characters/i)).not.toBeInTheDocument();
    fireEvent.blur(input);
    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
  });

  test('asks for interests before finishing, then saves and hands the profile back', () => {
    const onStart = jest.fn();
    render(<LocalProfile setScreen={jest.fn()} onStart={onStart} showToast={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Ada Lovelace' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    // "Continue" used to finish the whole flow, which made the interests step
    // unreachable: there was no way to ever see that screen.
    expect(onStart).not.toHaveBeenCalled();
    expect(screen.getByText('Your interests')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start learning as Ada Lovelace/i }));
    expect(onStart).toHaveBeenCalledWith(expect.objectContaining({ name: 'Ada Lovelace' }));
    expect(getProfile().name).toBe('Ada Lovelace');
  });

  test('does not save the name until the flow is finished', () => {
    render(<LocalProfile setScreen={jest.fn()} onStart={jest.fn()} showToast={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(getProfile()).toBeNull();
  });

  test('tells the user when the browser refuses to save', () => {
    const onStart = jest.fn();
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    render(<LocalProfile setScreen={jest.fn()} onStart={onStart} showToast={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /start learning as Ada/i }));
    expect(onStart).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/refused to save/i);
    setItem.mockRestore();
  });
});
