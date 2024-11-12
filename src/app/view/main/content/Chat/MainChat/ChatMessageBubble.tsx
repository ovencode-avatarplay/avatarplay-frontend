import {Avatar, Box} from '@mui/material';
import ChatMessageMenuTop from './ChatContextMenuTop';
import ChatMessageMenuBottom from './ChatContextMenuBottom';
import React, {useEffect, useState} from 'react';
import styles from '../Styles/ChatMessageMenu.module.css';

interface ChatMessageBubbleProps {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt' | 'userNarration';
  id: number;
  iconUrl: string;
  index: number;
  emoticonUrl: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTtsClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedIndex: number | null;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  text,
  sender,
  id,
  iconUrl,
  index,
  emoticonUrl,
  onClick,
  onTtsClick,
  selectedIndex,
}) => {
  const [textMessage, setTextMessage] = useState(text);

  const handleMenuOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sender !== 'user') {
      onClick(e);
    }
  };
  const handleTtsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onTtsClick(e);
  };

  const handleDelete = () => {
    setTextMessage('');
  };

  const handleModified = (newText: string) => {
    setTextMessage(newText);
  };

  return (
    <Box
      sx={{
        zIndex: selectedIndex === null ? 'auto' : index === selectedIndex ? 10 : 'auto',
        filter: selectedIndex === null ? 'none' : index === selectedIndex ? 'none' : 'blur(2px)', // 선택된 버블은 blur가 없음
        // pointerEvents: isSelected ? 'auto' : 'none', // 선택된 버블만 클릭 가능
      }}
    >
      <div className={styles.chatBubble}>
        {selectedIndex === index && <ChatMessageMenuTop id={id} />}
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent:
              sender === 'user' || sender === 'userNarration'
                ? 'flex-end'
                : sender === 'partner' || sender === 'narration'
                ? 'flex-start'
                : 'center',
            marginBottom: 2,
          }}
        >
          {sender === 'partner' && (
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
              padding: sender === 'system' ? '8px 55px' : '8px',
              borderRadius: '8px',
              maxWidth: sender === 'introPrompt' ? '100%' : sender === 'system' ? '100%' : '70%',
              backgroundColor:
                sender === 'introPrompt'
                  ? '#FFFFFF'
                  : sender === 'user' || sender === 'userNarration'
                  ? 'rgba(80, 80, 80, 0.8)'
                  : sender === 'partner' || sender === 'narration'
                  ? 'rgba(0, 0, 0, 0.8)'
                  : 'rgba(214, 214, 214, 0.2)',
              border: sender === 'introPrompt' || sender === 'system' ? '1px solid #C0C0C0' : 'none',
              backdropFilter: sender === 'system' ? 'blur(20px)' : 'none',
              textAlign: sender === 'narration' ? 'center' : 'inherit',
              color:
                sender === 'introPrompt'
                  ? '#000000'
                  : sender === 'system'
                  ? '#FFFFFF'
                  : sender === 'narration' || sender === 'userNarration'
                  ? '#B0B0B0'
                  : '#FFFFFF',
              fontSize: sender === 'narration' || sender === 'system' ? '0.7em' : '0.8em',
              fontWeight: sender === 'system' ? 'bold' : 'normal',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              textShadow:
                sender === 'system'
                  ? '1px 1px 0 rgba(116, 116, 116, 1.0), -1px -1px 0 rgba(116, 116, 116, 1.0), 1px -1px 0 rgba(116, 116, 116, 1.0), -1px 1px 0 rgba(116, 116, 116, 1.0)'
                  : 'none',
              marginLeft: sender === 'narration' ? '40px' : '0px',
            }}
            onClick={handleMenuOpen}
          >
            {sender === 'user' && emoticonUrl !== '' && emoticonUrl !== undefined ? (
              <img src={emoticonUrl} alt="Emoticon" style={{width: '24px', height: '24px', marginTop: '4px'}} />
            ) : (
              <div dangerouslySetInnerHTML={{__html: textMessage}} />
            )}
          </Box>
          {selectedIndex === index && (
            <ChatMessageMenuBottom
              text={text}
              id={id}
              onTtsClick={e => {
                handleTtsClick(e);
              }}
              onDelete={handleDelete}
              onModified={handleModified}
            />
          )}
        </Box>
      </div>
    </Box>
  );
};

export default ChatMessageBubble;
