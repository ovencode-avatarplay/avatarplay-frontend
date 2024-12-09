import React from 'react';
import styles from './ChatLoadingBubble.module.css';

interface ChatLoadingBubbleProps {
  iconUrl: string;
}

const ChatLoadingBubble: React.FC<ChatLoadingBubbleProps> = ({iconUrl}) => {
  return (
    <div className={styles.chatLoadingContainer}>
      <img className={styles.avatar} src={iconUrl} alt="Partner Avatar" />
      <div className={styles.bubble}>
        <span className={styles.loadingDots}>
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </span>
      </div>
    </div>
  );
};

export default ChatLoadingBubble;
