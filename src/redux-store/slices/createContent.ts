import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MainData, SainData, DataPair } from '@/types/apps/dataTypes'; // 데이터 타입을 불러오기

// ReduxState 인터페이스
interface TriggerSetupState {
    dataPairs: DataPair[]; // 여러 개의 메인-서브 페어를 저장하는 배열
}

// 초기 상태 정의
const initialState: TriggerSetupState = {
    dataPairs: [], // 빈 배열로 초기화
};

export const triggerSetupSlice = createSlice({
    name: 'triggerSetup',
    initialState,
    reducers: {
        // 페어 추가
        addDataPair: (state, action: PayloadAction<DataPair>) => {
            state.dataPairs.push(action.payload); // 새로운 페어 추가
        },

        // 특정 페어 수정
        updateDataPair: (state, action: PayloadAction<{ index: number, pair: DataPair }>) => {
            const { index, pair } = action.payload;
            if (state.dataPairs[index]) {
                state.dataPairs[index] = pair; // 해당 index의 페어 수정
            }
        },

        // 특정 페어 삭제
        removeDataPair: (state, action: PayloadAction<number>) => {
            state.dataPairs.splice(action.payload, 1); // 해당 index의 페어 삭제
        },
    },
});

// 액션 및 리듀서 내보내기
export const { addDataPair, updateDataPair, removeDataPair } = triggerSetupSlice.actions;
export const triggerSetupReducer = triggerSetupSlice.reducer;
export default triggerSetupSlice.reducer;