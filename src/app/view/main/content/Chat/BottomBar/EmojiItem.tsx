// EmojiItem.tsx
import React from 'react';
import styles from './EmojiItem.module.css';

interface EmojiItemProps {
  emoji: string;
  onEmojiClick: (emoji: string) => void; // onEmojiClick 프롭 추가
}

const EmojiItem: React.FC<EmojiItemProps> = ({emoji, onEmojiClick}) => {
  const handleEmojiClick = () => {
    onEmojiClick(emoji); // 전달된 onEmojiClick 함수 호출
  };

  return (
    <span className={styles.emoji} onClick={handleEmojiClick} role="button" aria-label={`emoji-${emoji}`} tabIndex={0}>
      {emoji}
    </span>
  );
};

export default EmojiItem;
