import React from 'react'
import TopBar from '@chats/TopBar/HeaderChat';
import BottomBar from '@chats/BottomBar/FooterChat';
import ChatArea from '@chats/MainChat/ChatArea';
import styles from '@chats/Styles/StyleChat.module.css'
import { Style } from '@mui/icons-material';

const ChatPage: React.FC = () => {
    const [messages, setMessages] = React.useState<{ text: string; sender: 'user' | 'partner' }[]>([]);

    const handleSendMessage = (message: string) => {
        setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    };

    // 2. 대화 상대 정보와 이벤트 핸들러 정의
    const handleBackClick = () => {
        console.log('뒤로 가기 버튼 클릭');
    };

    const handleMoreClick = () => {
        console.log('더보기 버튼 클릭');
    };

    const handleToggleBackground = () => {
        console.log('배경 보기/숨기기 버튼 클릭');
    };
    
    return (
        <main className={styles.chatmodal}>
            <TopBar username="아임 아이언맨~"
                description="말을 잘하는 아이"
                avatarUrl="https://example.com/avatar.jpg"
                onBackClick={handleBackClick}
                onMoreClick={handleMoreClick}
                onToggleBackground={handleToggleBackground}/>
            <ChatArea messages={messages} />
            {<BottomBar onSend={handleSendMessage} />}
        </main>
    )
}

export default ChatPage
