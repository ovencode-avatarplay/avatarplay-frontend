import React from 'react';
import styles from './ChatBubble.module.css';
import Avatar from '@mui/material/Avatar';

interface ChatBubbleProps {
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  isItalic?: boolean;
  profileImage?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  content,
  timestamp,
  isItalic = false,
  profileImage = '/images/profile_sample/img_sample_feed1.png',
}) => {
  const isMe = sender === 'me';

  return (
    <div className={`${styles.messageWrapper} ${isMe ? styles.right : styles.left}`}>
      {!isMe && <Avatar src={profileImage} sx={{width: 32, height: 32}} />}
      <div className={styles.bubbleBlock}>
        <div className={`${styles.bubble} ${isMe ? styles.myBubble : styles.otherBubble}`}>
          <p className={isItalic ? styles.italic : ''}>{content}</p>
        </div>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>
    </div>
  );
};

export default ChatBubble;
