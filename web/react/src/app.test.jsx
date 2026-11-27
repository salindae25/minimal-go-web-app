import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './app.jsx';

describe('React starter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });
  it('calls the Go API and displays its message', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: 'Hello from Go.' }) }),
    );
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Call the API' }));
    expect(fetch).toHaveBeenCalledWith('/api/hello');
    expect(await screen.findByText('Hello from Go.')).toBeTruthy();
  });
  it('shows a useful message when the API request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    render(<App />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Call the API' }));
    expect(await screen.findByText('Could not reach the Go API.')).toBeTruthy();
  });
});
