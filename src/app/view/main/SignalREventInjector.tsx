'use client';

import {useSignalR} from '@/hooks/useSignalR';
import React, {createContext, useContext} from 'react';

export const SignalRContext = createContext<ReturnType<typeof useSignalR> | null>(null);

export function SignalREventInjector({children}: {children: React.ReactNode}) {
  const token = localStorage.getItem('jwt');
  const signalR = useSignalR(token || '');
  return <SignalRContext.Provider value={signalR}>{children}</SignalRContext.Provider>;
}

export const useSignalRContext = () => useContext(SignalRContext);
