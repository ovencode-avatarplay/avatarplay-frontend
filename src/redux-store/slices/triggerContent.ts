import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MainData, SubData, DataPair } from '@/types/apps/dataTypes'; // 데이터 타입을 불러오기

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
        // 페어 추가 (name도 입력받도록 수정)
        addDataPair: (state, action: PayloadAction<Omit<DataPair, 'id'>>) => {
            const newDataPair: DataPair = { 
                ...action.payload, 
                id: state.dataPairs.length // 배열의 인덱스를 id로 사용
            };
            state.dataPairs.push(newDataPair);
        },

        // 특정 페어 수정
        updateDataPair: (state, action: PayloadAction<{ index: number, pair: Omit<DataPair, 'id'> }>) => {
            const { index, pair } = action.payload;
            if (state.dataPairs[index]) {
                state.dataPairs[index] = { ...pair, id: index }; // 해당 index의 id 유지하면서 페어 수정
            }
        },

        // 특정 페어 이름만 수정
        updateDataPairName: (state, action: PayloadAction<{ id: number, name: string }>) => {
            const { id, name } = action.payload;
            const pair = state.dataPairs.find(pair => pair.id === id); // id로 페어 찾기
            if (pair) {
                pair.name = name; // name 필드 업데이트
            }
        },

        // 특정 페어 삭제 후 id 업데이트
        removeDataPair: (state, action: PayloadAction<number>) => {
            state.dataPairs.splice(action.payload, 1); // 해당 index의 페어 삭제
            
            // 삭제 이후 모든 항목의 id를 배열 인덱스와 맞춰서 재할당
            state.dataPairs = state.dataPairs.map((pair, index) => ({
                ...pair,
                id: index, // 배열의 새로운 인덱스를 id로 재할당
            }));
        },
    },
});

// 액션 및 리듀서 내보내기
export const { addDataPair, updateDataPair, updateDataPairName, removeDataPair } = triggerSetupSlice.actions;
export const triggerSetupReducer = triggerSetupSlice.reducer;
export default triggerSetupSlice.reducer;
