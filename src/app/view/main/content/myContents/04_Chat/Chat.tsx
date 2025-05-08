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
import {DMChatType, MediaState, sendUrlEnterDMChat, UrlEnterDMChatReq} from '@/app/NetWork/ChatMessageNetwork';

export interface Message {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  isItalic?: boolean;
  mediaType?: MediaState;
  mediaUrl?: string;
}

interface Props {
  urlLinkKey: string;
}

const Chat: React.FC<Props> = ({urlLinkKey}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [chatRoomKey, setChatRoomKey] = useState(urlLinkKey);
  const handleSend = (text: string, mediaState: MediaState, mediaUrl: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'me',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    console.log('mediaStatmediaStatemediaStatee', mediaState);

    sendMessage(chatRoomKey, newMessage.content, 0, mediaState, mediaUrl);
  };

  const [isOpenEdit, setOpenEdit] = useAtom(isOpenEditAtom);
  console.log(messages);

  const jwt = localStorage.getItem('jwt'); // localStorage에서 JWT 가져오기
  const {joinRoom, onMessage, sendMessage} = useSignalR(jwt || '');

  useEffect(() => {
    onDM();
  }, []);

  const [anotherImageUrl, setAnotherImageUrl] = useState('');
  const [anotherProfileName, setAnotherProfileName] = useState('');
  const [anotherProfileEmail, setAnotherProfileEmail] = useState('');
  const onDM = async () => {
    if (!urlLinkKey) return;

    const payload: UrlEnterDMChatReq = {
      urlLinkKey,
    };

    try {
      const res = await sendUrlEnterDMChat(payload);
      if (!res.data) return;
      if (res.resultCode === 0) {
        const {prevMessageInfoList} = res.data;
        setAnotherImageUrl(res.data.anotherImageUrl);
        setAnotherProfileName(res.data.anotherProfileName);
        setAnotherProfileEmail(res.data.anotherProfileEmail);
        // ✅ 이전 메시지 변환
        const formattedMessages: Message[] = prevMessageInfoList.map(msg => ({
          id: msg.id,
          sender: msg.dmChatType === DMChatType.MyChat ? 'me' : 'other',
          content: msg.message,
          timestamp: new Date(msg.createAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          mediaType: msg.mediaState,
          mediaUrl: msg.mediaUrl,
        }));

        setMessages(formattedMessages);
        setChatRoomKey(chatRoomKey);
        joinRoom(chatRoomKey);

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
            mediaType: payload.mediaState,
            mediaUrl: payload.mediaUrl,
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
          <ChatHeader
            onClose={() => {}}
            anotherImageUrl={anotherImageUrl}
            anotherProfileEmail={anotherProfileEmail}
            anotherProfileName={anotherProfileName}
          />
          <ChatArea messages={messages} />
          <ChatBottom onSend={handleSend} />
          <ChatEditDrawer open={isOpenEdit} onClose={() => setOpenEdit(false)}></ChatEditDrawer>
        </div>
      </Box>
    </div>
  );
};

export default Chat;
