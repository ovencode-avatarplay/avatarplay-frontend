import React from 'react';
import styles from './EmojiItem.module.css';

interface EmojiItemProps {
  emoji: string; // 이미지 경로를 받음
  onEmojiClick: (emoji: string) => void;
}

const EmojiItem: React.FC<EmojiItemProps> = ({emoji, onEmojiClick}) => {
  const handleEmojiClick = () => {
    onEmojiClick(emoji);
  };

  return (
    <img
      src={emoji} // 이미지 경로 사용
      alt="emoji"
      className={styles.emoji}
      onClick={handleEmojiClick}
      role="button"
      tabIndex={0}
    />
  );
};

export default EmojiItem;
