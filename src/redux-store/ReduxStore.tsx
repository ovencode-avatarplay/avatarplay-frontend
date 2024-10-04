// Third-party Imports
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Slice Imports
import storage from 'redux-persist/lib/storage' // localStorage를 사용

// Sliced Imports
import sampleReducer from '@/redux-store/slices/ReduxSample'
import chatReducer from '@/redux-store/slices/chat'
import drawerContentDescReducer from '@/redux-store/slices/drawerContentDescSlice'
import triggerReducer from '@/redux-store/slices/triggerContent'
import ContentInfoSlice from './slices/ContentInfo'
import userInfo from './slices/userInfo'
import ContentSelection from './slices/ContentSelection'

// redux-persist (간단 요약 : 새로고침 해도 데이터 유지)   https://www.codenary.co.kr/discoveries/9170
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage,
    // 새로고침해도 데이터 유지 하고싶은 Slice 만 추가
    whitelist: ['sampleReducer', 'chatReducer', 'triggerReducer', 'ContentInfoSlice', 'userInfo', 'ContentSelection']
}

const reducers = combineReducers({
    // 사용할 모든 Slicer 추가
    sample: sampleReducer,
    chat: chatReducer,
    drawerContentDesc: drawerContentDescReducer,
    create: triggerReducer,
    content : ContentInfoSlice,
    user: userInfo,
    contentselection : ContentSelection,
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
