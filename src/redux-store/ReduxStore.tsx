// Third-party Imports
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // localStorage를 사용

// Slice Imports
import sampleReducer from '@/redux-store/slices/ReduxSample';
import chatReducer from '@/redux-store/slices/chat';
import chattingReducer from '@/redux-store/slices/chatting';
import drawerContentDescReducer from '@/redux-store/slices/drawerContentDescSlice';
import ContentInfoSlice from './slices/ContentInfo';
import userInfo from './slices/userInfo';
import ContentSelection from './slices/ContentSelection';
import publishInfoSlice from './slices/PublishInfo';
import chapterBoardSlice from './slices/ChapterBoard';
import episodeInfoSlice from './slices/EpisodeInfo';

// redux-persist
import {persistStore, persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['sample', 'chat', 'chatting', 'content', 'user', 'contentselection'],
};

const reducers = combineReducers({
  sample: sampleReducer,
  // chat: chatReducer,
  chatting: chattingReducer, // 서버데이터 Chatting/
  drawerContentDesc: drawerContentDescReducer,
  content: ContentInfoSlice,
  user: userInfo,

  contentselection: ContentSelection,
  publish: publishInfoSlice,
  chapterBoard: chapterBoardSlice,
  episode: episodeInfoSlice,
});

// persistReducer로 reducers 감싸기
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer, // Persisted reducer 사용
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);

// 스토리지 초기화 (Data 구조가 크게 바뀌었는데 persistor가 예전 Data로 복구를 해서 문제 일으키는 경우 수동으로 데이터 날리고 다시 확인하기)
persistor.purge();

// RootState와 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
