// src/test/setup.js
// Vitest setup file: adds jest-dom matchers and cleans up the DOM after each test.
// Required packages (dev): @testing-library/jest-dom, @testing-library/react, jsdom, vitest
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Default localStorage stub for jsdom; tests may override.
if (!globalThis.localStorage) {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}
