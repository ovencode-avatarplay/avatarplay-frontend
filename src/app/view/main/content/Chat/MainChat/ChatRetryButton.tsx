import React from 'react';
import styles from './ChatRetryButton.module.css';
import Retry from '@ui/chatting/Icons/MessageMenu/Regenerate.svg';

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
        <img src={Retry.src} />
      </div>

      <span>Retry</span>
    </div>
  );
};

export default ChatRetryButton;
