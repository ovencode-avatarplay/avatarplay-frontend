import React from 'react';
import styles from '@chats/Styles/StyleChat.module.css';

const ChatArea: React.FC<{ messages: { text: string; sender: 'user' | 'partner' }[] }> = ({ messages }) => {
    return (
      <div className={styles.chatarea}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === 'partner' ? (
              <>
                <img src="대화상대_이미지_URL" alt="대화상대" className={styles.avatar} />
                <span className={styles.bubble}>{msg.text}</span>
              </>
            ) : (
              <span className={`${styles.bubble} ${styles["user-bubble"]}`}>{msg.text}</span>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default ChatArea;