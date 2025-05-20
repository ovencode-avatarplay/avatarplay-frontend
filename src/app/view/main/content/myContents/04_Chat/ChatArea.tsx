import React, {useEffect, useRef} from 'react';
import styles from './ChatArea.module.css';
import ChatBubble from './ChatBubble';
import ChatBlur from './ChatBlur';
import {useAtom} from 'jotai';
import {isOpenAddContentAtom, isOpenEmojiPickerAtom} from './ChatAtom';
import {DMChatMessage, DMChatType} from '@/app/NetWork/ChatMessageNetwork';

interface Props {
  messages: DMChatMessage[];
}

// "8:05 am" → "8:05"
const extractMinute = (timestamp: string) => {
  const date = new Date(timestamp);
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

const ChatArea: React.FC<Props> = ({messages}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'instant'});
  }, [messages]);

  const [isOpenAddContent, setIsOpenAddContent] = useAtom(isOpenAddContentAtom);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useAtom(isOpenEmojiPickerAtom);
  return (
    <div
      className={styles.chatArea}
      onClick={() => {
        setIsOpenAddContent(false);
        setIsOpenEmojiPicker(false);
      }}
    >
      {messages.map((msg, idx) => {
        const prevMsg = messages[idx - 1];
        const nextMsg = messages[idx + 1];

        const currentMinute = extractMinute(msg.createAt);
        const prevMinute = prevMsg ? extractMinute(prevMsg.createAt) : null;
        const nextMinute = nextMsg ? extractMinute(nextMsg.createAt) : null;

        // 시간 표시: 같은 분의 마지막 메시지에만
        const shouldShowTimestamp = !nextMsg || extractMinute(nextMsg.createAt) !== currentMinute;

        // 간격: 분이 바뀔 때만 30px
        const isNewMinute = !prevMsg || currentMinute !== prevMinute;
        const gapClass = isNewMinute ? styles.gapLarge : styles.gapSmall;

        return (
          <div key={msg.id} className={gapClass}>
            <ChatBubble
              sender={msg.dmChatType === DMChatType.MyChat ? 'me' : 'other'}
              content={msg.message}
              timestamp={shouldShowTimestamp ? currentMinute : ''}
              isItalic={false}
              id={msg.id}
              mediaType={msg.mediaState}
              mediaUrl={msg.mediaUrl}
              profileImage={msg.profileImageUrl}
              profileUrlLinkKey={msg.profileUrlLinkKey}
              chatState={msg.chatState}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
      <ChatBlur></ChatBlur>
    </div>
  );
};

export default ChatArea;
