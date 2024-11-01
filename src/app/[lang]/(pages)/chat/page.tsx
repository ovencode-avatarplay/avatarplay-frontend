'use client';

import Chat from '@/app/view/main/content/ChatPage';
import {Provider} from 'react-redux';
import {store} from '@/redux-store/ReduxStore';
import {EmojiCacheProvider} from '@/app/view/main/content/Chat/BottomBar/EmojiCacheContext';

export default function ChatPage() {
  return <Chat />;
}
