import React from 'react';
import styles from './ChatRetryButton.module.css';
import {Regenerate} from '@ui/chatting';

interface ChatRetryButtonProps {
  retrySend: () => void;
}

const ChatRetryButton: React.FC<ChatRetryButtonProps> = ({retrySend}) => {
  const handleClick = () => {
    retrySend();
  };

  return (
    <div className={styles.chatRetryButton} onClick={handleClick}>
      <div className={styles.retryIcon}>
        <img src={Regenerate.src} />
      </div>

      <span>Retry</span>
    </div>
  );
};

export default ChatRetryButton;
