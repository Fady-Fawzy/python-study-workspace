import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { OfflineStatus } from './OfflineStatus';

const setOnline = (value: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value
  });
};

afterEach(() => {
  setOnline(true);
  cleanup();
});

describe('OfflineStatus', () => {
  it('announces offline mode and removes the notice after reconnecting', async () => {
    setOnline(false);
    render(<OfflineStatus />);

    expect(screen.getByRole('status')).toHaveTextContent(/offline mode/i);
    act(() => window.dispatchEvent(new Event('online')));
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  it('responds to a later network drop', async () => {
    setOnline(true);
    render(<OfflineStatus />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    setOnline(false);
    act(() => window.dispatchEvent(new Event('offline')));
    expect(await screen.findByRole('status')).toHaveTextContent(/cached lessons/i);
  });
});
