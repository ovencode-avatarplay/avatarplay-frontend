import {Avatar, Box} from '@mui/material';
import ChatMessageMenuTop from './ChatMessageMenuTop';
import ChatMessageMenuBottom from './ChatMessageMenuBottom';
import {useState} from 'react';

interface ChatMessageBubbleProps {
  text: string;
  sender: 'user' | 'partner' | 'narration' | 'system' | 'introPrompt' | 'userNarration';
  iconUrl: string;
  index: number;
  emoticonUrl: string;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({text, sender, iconUrl, index, emoticonUrl}) => {
  const [isMessageMenuOpen, setMessageMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMessageMenuOpen(!isMessageMenuOpen);
  };

  return (
    <Box onClick={handleMenuOpen}>
      {isMessageMenuOpen && <ChatMessageMenuTop />}
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
        >
          {sender === 'user' && emoticonUrl !== '' && emoticonUrl !== undefined ? (
            <img src={emoticonUrl} alt="Emoticon" style={{width: '24px', height: '24px', marginTop: '4px'}} />
          ) : (
            <div dangerouslySetInnerHTML={{__html: text}} />
          )}
        </Box>
      </Box>
      {isMessageMenuOpen && <ChatMessageMenuBottom />}
    </Box>
  );
};

export default ChatMessageBubble;
