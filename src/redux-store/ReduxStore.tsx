import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';


//#region  Sample Redux 
// Redux 사용 GuideLine 입니다. 실제 사용 X
export interface ReduxSampleData {
    key : number;
    data : string;
}

// ReduxState 인터페이스
interface ReduxSampleState {
    redux: Record<number, ReduxSampleData>; // C#의 Dictionary처럼 key-value 형태
}

const initialState: ReduxSampleState = {
    redux: {}, // 빈 객체로 초기화
};

// reduxSlice 생성
const reduxSlice = createSlice({
    name: 'reduxSample',
    initialState,
    reducers: {
        // Data 추가
        AddSampleData: (state, action: PayloadAction<ReduxSampleData>) => {
            const sampleData = action.payload;
            state.redux[sampleData.key] = sampleData; // key를 기준으로 데이터 추가
        },

        // Data 수정
        SetSampleData: (state, action: PayloadAction<ReduxSampleData>) => {
            const sampleData = action.payload;
            if (state.redux[sampleData.key]) {
                state.redux[sampleData.key] = sampleData; // 해당 key에 있는 데이터 수정
            }
        },

        // Data 삭제 (key 타입은 number)
        RemoveSampleData: (state, action: PayloadAction<number>) => {
            const key = action.payload;
            if (state.redux[key]) {
                delete state.redux[key]; // 해당 key의 데이터 삭제
            }
        },
    },
});

// 액션 및 리듀서 내보내기
export const { AddSampleData, SetSampleData, RemoveSampleData } = reduxSlice.actions;
export const reduxSampleReducer = reduxSlice.reducer;

//#endregion

// Redux 스토어 구성
export const store = configureStore({
    reducer: {
        // reduxSample : reduxSampleReducer,

    },
});


// RootState와 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
