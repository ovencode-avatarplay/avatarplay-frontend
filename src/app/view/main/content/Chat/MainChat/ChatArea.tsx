import React, {useEffect, useRef, useState} from 'react';
import {Box, Avatar} from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';

interface Message {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt' | 'userNarration';
}

interface MessageGroup {
  Messages: Message[];
  emoticonUrl: string[]; // 이모티콘 URL 배열
}

interface ChatAreaProps {
  messages: MessageGroup;
  bgUrl: string;
  iconUrl: string;
  isHideChat: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({messages, bgUrl, iconUrl, isHideChat: isHideChat}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  // const [isHideChat, SetIsHideChatOn] = useState<boolean>(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  // useEffect(() => {
  //   // SetIsHideChatOn(isHideChat);
  // }, [isHideChat]);

  return (
    <Box
      className={styles.chatArea}
      sx={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        width: '100%',
        position: 'relative',
        fontFamily: 'Noto Sans KR, sans-serif',
      }}
    >
      {isHideChat === false &&
        messages.Messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent:
                msg.sender === 'user' || msg.sender === 'userNarration'
                  ? 'flex-end'
                  : msg.sender === 'partner' || msg.sender === 'narration'
                  ? 'flex-start'
                  : 'center',
              marginBottom: 2,
            }}
          >
            {msg.sender === 'partner' && (
              <Avatar
                alt="Partner Avatar"
                src={iconUrl}
                sx={{
                  width: 32,
                  height: 32,
                  marginRight: 1,
                  border: '1px solid',
                  borderColor: 'black',
                }}
              />
            )}
            <Box
              sx={{
                display: 'inline-block',
                padding: msg.sender === 'system' ? '8px 55px' : '8px',
                borderRadius: '8px',
                maxWidth: msg.sender === 'introPrompt' ? '100%' : msg.sender === 'system' ? '100%' : '70%',
                backgroundColor:
                  msg.sender === 'introPrompt'
                    ? '#FFFFFF'
                    : msg.sender === 'user' || msg.sender === 'userNarration'
                    ? 'rgba(80, 80, 80, 0.8)'
                    : msg.sender === 'partner' || msg.sender === 'narration'
                    ? 'rgba(0, 0, 0, 0.8)'
                    : 'rgba(214, 214, 214, 0.2)',
                border: msg.sender === 'introPrompt' || msg.sender === 'system' ? '1px solid #C0C0C0' : 'none',
                backdropFilter: msg.sender === 'system' ? 'blur(20px)' : 'none',
                textAlign: msg.sender === 'narration' ? 'center' : 'inherit',
                color:
                  msg.sender === 'introPrompt'
                    ? '#000000'
                    : msg.sender === 'system'
                    ? '#FFFFFF'
                    : msg.sender === 'narration' || msg.sender === 'userNarration'
                    ? '#B0B0B0' // 회색 텍스트 색상
                    : '#FFFFFF',
                fontSize: msg.sender === 'narration' || msg.sender === 'system' ? '0.7em' : '0.8em',
                fontWeight: msg.sender === 'system' ? 'bold' : 'normal',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                textShadow:
                  msg.sender === 'system'
                    ? '1px 1px 0 rgba(116, 116, 116, 1.0), -1px -1px 0 rgba(116, 116, 116, 1.0), 1px -1px 0 rgba(116, 116, 116, 1.0), -1px 1px 0 rgba(116, 116, 116, 1.0)'
                    : 'none',
                // `narration` 박스에 `partner` 아바타 크기(32px) + 간격(1) 적용
                marginLeft: msg.sender === 'narration' ? '40px' : '0px',
              }}
            >
              {msg.sender === 'user' && messages.emoticonUrl[index] ? (
                <>
                  <img
                    src={messages.emoticonUrl[index]}
                    alt="Emoticon"
                    style={{width: '24px', height: '24px', marginTop: '4px'}}
                  />
                </>
              ) : (
                <div dangerouslySetInnerHTML={{__html: msg.text}} />
              )}
            </Box>
          </Box>
        ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatArea;
