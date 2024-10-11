'use client'

import React from 'react'
import TopBar from '@chats/TopBar/HeaderChat';
import BottomBar from '@chats/BottomBar/FooterChat';
import ChatArea from '@chats/MainChat/ChatArea';
import styles from '@chats/Styles/StyleChat.module.css'
import { Style } from '@mui/icons-material';
//import { useRouter } from 'next/navigation';
import {useBackHandler}  from 'utils/util-1';

const ChatPage: React.FC = () => {
    const [messages, setMessages] = React.useState<{ text: string; sender: 'user' | 'partner' }[]>([]);

    const handleBackClick = useBackHandler();

    const handleSendMessage = (message: string) => {
        setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    };

    const handleMoreClick = () => {
        console.log('더보기 버튼 클릭');
    };

    const handleToggleBackground = () => {
        console.log('배경 보기/숨기기 버튼 클릭');
    };
    
    return (
        <main className={styles.chatmodal}>
            <TopBar 
                onBackClick={handleBackClick}
                onMoreClick={handleMoreClick}
                onToggleBackground={handleToggleBackground}/>
            <ChatArea messages={messages} />
            {<BottomBar onSend={handleSendMessage} />}
        </main>
    )
}

export default ChatPage
