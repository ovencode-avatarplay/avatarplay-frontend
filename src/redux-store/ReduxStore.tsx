// Third-party Imports
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Slice Imports
import storage from 'redux-persist/lib/storage' // localStorage를 사용

// Sliced Imports
import sampleReducer from '@/redux-store/slices/ReduxSample'
import chatReducer from '@/redux-store/slices/chat'
import chattingReducer from '@/redux-store/slices/chatting'
import drawerContentDescReducer from '@/redux-store/slices/drawerContentDescSlice'
import ContentInfoSlice from './slices/ContentInfo'
import userInfo from './slices/userInfo'
import ContentSelection from './slices/ContentSelection'
import conversationTalkReducer from './slices/conversationTalk'
import publishInfoSlice from './slices/PublishInfo'
import chapterBoardSlice from './slices/ChapterBoard'
import episodeInfoSlice from './slices/EpisodeInfo'

// redux-persist (간단 요약 : 새로고침 해도 데이터 유지)   https://www.codenary.co.kr/discoveries/9170
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage,
    // 새로고침해도 데이터 유지하고 싶은 Slice만 추가
    whitelist: [
        'sample', 
        'chat', 
        'chatting',  // chatting 추가
        'content', 
        'user', 
        'contentselection', 
        'conversationTalk'
    ]
}

const reducers = combineReducers({
    // 사용할 모든 Slicer 추가
    sample: sampleReducer,
    chat: chatReducer,
    chatting: chattingReducer,  // chatting
    drawerContentDesc: drawerContentDescReducer,
    content: ContentInfoSlice, 
    user: userInfo,
    contentselection: ContentSelection, 
    conversationTalk: conversationTalkReducer, 
    publish: publishInfoSlice,
    chapterBoard: chapterBoardSlice, 
    episode: episodeInfoSlice,
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer, // Persisted reducer를 사용
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store);

// RootState와 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

