import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { clearApiKey, getApiKey, setApiKey as persistApiKey } from '@/lib/storage';

type ApiKeyContextValue = {
  apiKey: string | null;
  ready: boolean;
  setApiKey: (key: string) => Promise<void>;
  clearKey: () => Promise<void>;
  hasKey: boolean;
};

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const key = await getApiKey();
      if (mounted) {
        setApiKeyState(key);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setApiKey = useCallback(async (key: string) => {
    await persistApiKey(key);
    setApiKeyState(key.trim());
  }, []);

  const clearKey = useCallback(async () => {
    await clearApiKey();
    setApiKeyState(null);
  }, []);

  const value = useMemo(
    () => ({
      apiKey,
      ready,
      setApiKey,
      clearKey,
      hasKey: Boolean(apiKey),
    }),
    [apiKey, ready, setApiKey, clearKey],
  );

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return ctx;
}
