import { useContext } from 'react';
import { FireContext } from './fireContextDef';
import type { FireContextType } from './fireContextDef';

export function useFireContext(): FireContextType {
  const ctx = useContext(FireContext);
  if (!ctx) throw new Error('useFireContext must be inside <FireProvider>');
  return ctx;
}
