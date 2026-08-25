import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

function getOnlineState(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine;
}

export const OfflineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(getOnlineState);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-status" role="status" aria-live="polite">
      <WifiOff size={15} aria-hidden="true" />
      <span>Offline mode — cached lessons remain available.</span>
    </div>
  );
};
