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
import {
  DMChatType,
  MediaState,
  sendUrlEnterDMChat,
  UrlEnterDMChatReq,
  sendReadChatRoom,
  DMChatMessage,
} from '@/app/NetWork/ChatMessageNetwork';
import useCustomRouter from '@/utils/useCustomRouter';

interface Props {
  urlLinkKey: string;
}

const Chat: React.FC<Props> = ({urlLinkKey}) => {
  const [messages, setMessages] = useState<DMChatMessage[]>([]);
  const [roomId, setRoomId] = useState<number>(0);

  const {back} = useCustomRouter();
  const [chatRoomKey, setChatRoomKey] = useState(urlLinkKey);
  const handleSend = (text: string, mediaState: MediaState, mediaUrl: string) => {
    const newMessage: DMChatMessage = {
      id: messages.length + 1,
      dmChatType: DMChatType.MyChat,
      profileUrlLinkKey: '', // 현재 사용자의 profileUrlLinkKey
      profileImageUrl: '', // 현재 사용자의 profileImageUrl
      profileName: '', // 현재 사용자의 profileName
      message: text,
      mediaState: mediaState,
      mediaUrl: mediaUrl,
      emoticonId: 0,
      createAt: new Date().toISOString(),
    };

    sendMessage(chatRoomKey, newMessage.message, 0, mediaState, mediaUrl);
  };

  const [isOpenEdit, setOpenEdit] = useAtom(isOpenEditAtom);
  console.log(messages);

  const jwt = localStorage.getItem('jwt');
  const {joinRoom, leaveRoom, onMessage, sendMessage} = useSignalR(jwt || '');

  useEffect(() => {
    onDM();
    return () => {
      if (chatRoomKey) {
        leaveRoom(chatRoomKey).catch(error => {
          console.log('채팅방 퇴장 중 에러:', error);
        });
      }
    };
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
        setRoomId(res.data.roomId);

        setMessages(prevMessageInfoList);
        setChatRoomKey(chatRoomKey);
        joinRoom(chatRoomKey);

        // ✅ 새 메시지 수신 핸들러
        onMessage(payload => {
          setMessages(prev => [...prev, payload]);

          // 상대방이 보낸 메시지일 경우에만 읽음 처리
          if (payload.dmChatType === DMChatType.AnotherChat) {
            sendReadChatRoom({roomId: roomId}).catch(error => console.error('채팅방 읽음 처리 실패:', error));
          }
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
            onClose={() => {
              back();
            }}
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
