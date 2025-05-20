// Third-party Imports
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // localStorage를 사용

// Slice Imports
import sampleReducer from '@/redux-store/slices/ReduxSample';
import chattingReducer from '@/redux-store/slices/Chatting';
import drawerStoryDescReducer from '@/redux-store/slices/DrawerContentDescSlice';
import drawerCharacterDescReducer from '@/redux-store/slices/DrawerCharacterDescSlice';
import StoryInfoSlice from './slices/StoryInfo';
import userInfo from './slices/UserInfo';
import publishInfoSlice from './slices/PublishInfo';
// import episodeInfoSlice from './slices/EpisodeInfo';
import myStoryDashboardSlice from './slices/MyStoryDashboard';
import emoticonSlice from './slices/EmoticonSlice';
import modifyQuestionSlice from './slices/ModifyQuestion';
import profileReducer from './slices/Profile';
import mainControl from './slices/MainControl';
// redux-persist
import {persistStore, persistReducer} from 'redux-persist';
import chattingEnterSlice from './slices/ChattingEnter';
// slice currency
import currencySlice from './slices/Currency';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['sample', 'chat', 'chatting', 'chattingEnter', 'content', 'user', 'contentselection', 'currencyInfo'],
};

const reducers = combineReducers({
  sample: sampleReducer,
  user: userInfo,
  profile: profileReducer,

  //#region Main
  mainControl: mainControl,
  //#endregion

  chatting: chattingReducer, // 서버데이터 Chatting/

  //#region  Explore
  drawerStoryDesc: drawerStoryDescReducer, // 현재
  drawerCharacterDesc: drawerCharacterDescReducer, // 현재
  //#endregion

  //#region  Create
  myStories: myStoryDashboardSlice, // 내가 만든 컨텐츠들 (Dashboard 표시용)

  story: StoryInfoSlice, // 현재 편집중인 컨텐츠 (서버와 데이터 교환 용)
  publish: publishInfoSlice, // 현재 편집중인 컨텐츠의 publish 정보 (Content 수정용)
  // episode: episodeInfoSlice, // 현재 편집중인 에피소드 정보 (Content 수정용)
  chattingEnter: chattingEnterSlice,
  emoticon: emoticonSlice,
  modifyQuestion: modifyQuestionSlice,
  //#endregion
  currencyInfo: currencySlice,
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
