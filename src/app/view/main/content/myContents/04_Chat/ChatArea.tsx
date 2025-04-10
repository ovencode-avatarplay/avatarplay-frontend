import React, {useEffect, useRef} from 'react';
import styles from './ChatArea.module.css';
import ChatBubble from './ChatBubble';

interface Message {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string; // e.g., "8:05 am"
  isItalic?: boolean;
}

interface Props {
  messages: Message[];
}

// "8:05 am" → "8:05"
const extractMinute = (timestamp: string) => {
  const [time] = timestamp.split(' ');
  const [hour, minute] = time.split(':');
  return `${hour}:${minute}`;
};

const ChatArea: React.FC<Props> = ({messages}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <div className={styles.chatArea}>
      {messages.map((msg, idx) => {
        const prevMsg = messages[idx - 1];
        const nextMsg = messages[idx + 1];

        const currentMinute = extractMinute(msg.timestamp);
        const prevMinute = prevMsg ? extractMinute(prevMsg.timestamp) : null;
        const nextMinute = nextMsg ? extractMinute(nextMsg.timestamp) : null;

        // 시간 표시: 같은 분의 마지막 메시지에만
        const shouldShowTimestamp = !nextMsg || extractMinute(nextMsg.timestamp) !== currentMinute;

        // 간격: 분이 바뀔 때만 30px
        const isNewMinute = !prevMsg || currentMinute !== prevMinute;
        const gapClass = isNewMinute ? styles.gapLarge : styles.gapSmall;

        return (
          <div key={msg.id} className={gapClass}>
            <ChatBubble
              sender={msg.sender}
              content={msg.content}
              timestamp={shouldShowTimestamp ? msg.timestamp : ''}
              isItalic={msg.isItalic}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;
