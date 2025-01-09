import React, {useEffect, useState} from 'react';
import styles from './ChatLoadingBubble.module.css';
import {ChatLoading, Variant1, Variant2, Variant3, Variant4, Variant5, Variant6} from '@ui/chatting';

interface ChatLoadingBubbleProps {
  iconUrl: string;
}

const variants = [Variant1, Variant2, Variant3, Variant4, Variant5, Variant6];

const ChatLoadingBubble: React.FC<ChatLoadingBubbleProps> = ({iconUrl}) => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVariantIndex(prevIndex => (prevIndex + 1) % variants.length);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.chatLoadingContainer}>
      <img className={styles.avatar} src={iconUrl} alt="Partner Avatar" />
      <div className={styles.chatLoadingBackground}>
        <img className={styles.loadingVariant} src={variants[currentVariantIndex].src} alt="Loading Variant" />
      </div>
    </div>
  );
};

export default ChatLoadingBubble;
