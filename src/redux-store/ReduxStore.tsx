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
import episodeInfoSlice from './slices/EpisodeInfo';
import myContentDashboardSlice from './slices/myContentDashboard';

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
  user: userInfo,

  chatting: chattingReducer, // 서버데이터 Chatting/

  //#region  Explore
  drawerContentDesc: drawerContentDescReducer, // 현재
  //#endregion

  //#region  Create
  myContents: myContentDashboardSlice, // 내가 만든 컨텐츠들 (Dashboard 표시용)

  content: ContentInfoSlice, // 현재 편집중인 컨텐츠 (서버와 데이터 교환 용)
  contentselection: ContentSelection, // 현재 선택된 컨텐츠,챕터,에피소드 정보 (ChapterBoard 선택용)
  publish: publishInfoSlice, // 현재 편집중인 컨텐츠의 publish 정보 (Content 수정용)
  episode: episodeInfoSlice, // 현재 편집중인 에피소드 정보 (Content 수정용)
  //#endregion
});

// persistReducer로 reducers 감싸기
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer, // Persisted reducer 사용
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);

// 스토리지 초기화 (Data 구조가 크게 바뀌었는데 persistor가 예전 Data로 복구를 해서 문제 일으키는 경우 수동으로 데이터 날리고 다시 확인하기)
//persistor.purge();

// RootState와 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
