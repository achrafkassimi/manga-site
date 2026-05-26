// src/test/AuthContext.test.jsx
// Smoke test for AuthContext: provider mounts and exposes default unauthenticated state.
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

const Probe = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="is-auth">{String(auth.isAuthenticated)}</span>
      <span data-testid="user">{auth.user ? auth.user.username : 'none'}</span>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('exposes unauthenticated state by default', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-auth').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('none');
  });
});
