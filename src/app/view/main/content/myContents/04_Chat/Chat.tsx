import React, {useState} from 'react';
import styles from './Chat.module.css';
import ChatHeader from './ChatHeader';
import ChatArea from './ChatArea';
import ChatBottom from './ChatBottom';
import {Modal, Box} from '@mui/material';
import {useAtom} from 'jotai';
import {isOpenEditAtom} from './ChatAtom';
import ChatEditDrawer from './ChatEditDrawer';

interface Message {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  isItalic?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const Chat: React.FC<Props> = ({open, onClose}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'other',
      content: 'I am the Guuji of the Grand Narukami Shrine. The purpose of my visit is to monitor your every move...',
      timestamp: '8:00 am',
    },
    {
      id: 2,
      sender: 'me',
      content: 'Ah, Guuji of the Grand Narukami Shrine! Your presence is as radiant as a cherry blossom in full bloom.',
      timestamp: '8:05 am',
    },
  ]);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'me',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const [isOpenEdit, setOpenEdit] = useAtom(isOpenEditAtom);
  console.log(isOpenEdit);
  return (
    <Modal
      open={open}
      onClose={() => {}}
      BackdropProps={{
        sx: {background: 'rgba(255, 255, 255, 0.7)'},
      }}
    >
      <Box className={styles.modalBox}>
        <div className={styles.container}>
          <ChatHeader
            onClose={() => {
              onClose();
            }}
          />
          <ChatArea messages={messages} />
          <ChatBottom onSend={handleSend} />
          <ChatEditDrawer open={isOpenEdit} onClose={() => setOpenEdit(false)}></ChatEditDrawer>
        </div>
      </Box>
    </Modal>
  );
};

export default Chat;
