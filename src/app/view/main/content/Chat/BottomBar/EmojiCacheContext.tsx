// src/context/EmojiCacheContext.tsx
import React, {createContext, useContext, useState} from 'react';

interface CachedImage {
  id: number;
  url: string;
  isFavorite: boolean;
}

interface EmojiCacheContextType {
  cachedImages: Record<number, CachedImage[]>;
  setCachedImages: React.Dispatch<React.SetStateAction<Record<number, CachedImage[]>>>;
  resetCache: () => void;
  updateFavoriteStatus: (emoticonId: number, isFavorite: boolean) => void;
}

const EmojiCacheContext = createContext<EmojiCacheContextType | undefined>(undefined);

export const EmojiCacheProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [cachedImages, setCachedImages] = useState<Record<number, CachedImage[]>>({});

  const resetCache = () => setCachedImages({});
  // src/context/EmojiCacheContext.tsx

  const updateFavoriteStatus = (emoticonId: number, isFavorite: boolean) => {
    setCachedImages(prev => {
      const updatedImages = {...prev};

      // cachedImages의 모든 키를 순회하며 해당 이모티콘의 isFavorite 상태 업데이트
      Object.keys(updatedImages).forEach(key => {
        updatedImages[Number(key)] = updatedImages[Number(key)].map(image =>
          image.id === emoticonId ? {...image, isFavorite} : image,
        );
      });

      return updatedImages;
    });
  };

  return (
    <EmojiCacheContext.Provider value={{cachedImages, setCachedImages, resetCache, updateFavoriteStatus}}>
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
