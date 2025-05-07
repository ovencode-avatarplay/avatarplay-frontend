import React, {useEffect, useState} from 'react';
import styles from './Chat.module.css';
import ChatHeader from './ChatHeader';
import ChatArea from './ChatArea';
import ChatBottom from './ChatBottom';
import {Modal, Box} from '@mui/material';
import {useAtom} from 'jotai';
import {isOpenEditAtom} from './ChatAtom';
import ChatEditDrawer from './ChatEditDrawer';
import zIndex from '@mui/material/styles/zIndex';
import {useSignalR} from '@/hooks/useSignalR';
import {DMChatType, sendUrlEnterDMChat, UrlEnterDMChatReq} from '@/app/NetWork/ChatMessageNetwork';

interface Message {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  isItalic?: boolean;
}

interface Props {
  urlLinkKey: string;
}

const Chat: React.FC<Props> = ({urlLinkKey}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [chatRoomId, setChatRoomId] = useState(0);
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
    console.log('');
    sendMessage(chatRoomId, newMessage.content);
  };

  const [isOpenEdit, setOpenEdit] = useAtom(isOpenEditAtom);
  console.log(messages);

  const jwt = localStorage.getItem('jwt'); // localStorage에서 JWT 가져오기
  const {joinRoom, onMessage, sendMessage} = useSignalR(jwt || '');

  useEffect(() => {
    onDM();
  }, []);

  const onDM = async () => {
    if (!urlLinkKey) return;

    const payload: UrlEnterDMChatReq = {
      urlLinkKey,
      chatRoomId: 0,
    };

    try {
      const res = await sendUrlEnterDMChat(payload);
      if (!res.data) return;
      if (res.resultCode === 0) {
        const {chatRoomId, prevMessageInfoList} = res.data;

        // ✅ 이전 메시지 변환
        const formattedMessages: Message[] = prevMessageInfoList.map(msg => ({
          id: msg.id,
          sender: msg.dmChatType === DMChatType.MyChat ? 'me' : 'other',
          content: msg.message,
          timestamp: new Date(msg.createAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setMessages(formattedMessages);
        setChatRoomId(chatRoomId);
        joinRoom(chatRoomId);

        // ✅ 새 메시지 수신 핸들러
        onMessage(payload => {
          const newMsg: Message = {
            id: payload.id,
            sender: payload.dmChatType === DMChatType.MyChat ? 'me' : 'other',
            content: payload.message,
            timestamp: new Date(payload.createAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
          setMessages(prev => [...prev, newMsg]);
        });

        return;
      } else {
        console.warn(`⚠️ 오류: ${res.resultMessage}`);
      }
    } catch (error: any) {
      console.error('❌ onDM error:', error);
    }
  };
  return (
    <div style={{background: 'rgba(255, 255, 255, 0.7)'}}>
      <Box className={styles.modalBox}>
        <div className={styles.container}>
          <ChatHeader onClose={() => {}} />
          <ChatArea messages={messages} />
          <ChatBottom onSend={handleSend} />
          <ChatEditDrawer open={isOpenEdit} onClose={() => setOpenEdit(false)}></ChatEditDrawer>
        </div>
      </Box>
    </div>
  );
};

export default Chat;
