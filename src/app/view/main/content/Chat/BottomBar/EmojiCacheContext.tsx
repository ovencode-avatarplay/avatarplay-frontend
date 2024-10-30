// src/context/EmojiCacheContext.tsx
import React, {createContext, useContext, useState} from 'react';

interface CachedImage {
  id: number;
  url: string;
}

interface EmojiCacheContextType {
  cachedImages: Record<number, CachedImage[]>;
  setCachedImages: React.Dispatch<React.SetStateAction<Record<number, CachedImage[]>>>;
  resetCache: () => void; // 캐시 초기화 함수
}

const EmojiCacheContext = createContext<EmojiCacheContextType | undefined>(undefined);

export const EmojiCacheProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [cachedImages, setCachedImages] = useState<Record<number, CachedImage[]>>({});

  // 캐시 초기화 함수
  const resetCache = () => setCachedImages({});

  return (
    <EmojiCacheContext.Provider value={{cachedImages, setCachedImages, resetCache}}>
      {children}
    </EmojiCacheContext.Provider>
  );
};

// 캐시 컨텍스트 사용을 위한 커스텀 훅
export const useEmojiCache = () => {
  const context = useContext(EmojiCacheContext);
  if (!context) throw new Error('useEmojiCache must be used within an EmojiCacheProvider');
  return context;
};
