// Imports
import { ContentInfo } from '@/types/apps/content/contentInfo';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import defaultContent from '@/data/create/content-info-data.json'; // JSON 파일

// JSON 데이터 타입 정의
interface ContentInfoState {
    contentInfo: ContentInfo[];
}

// 초기 상태
const initialState: ContentInfoState = {
    contentInfo: defaultContent.contentInfo // defaultContent가 배열인지 확인
};

// Slice 생성
export const contentInfoSlice = createSlice({
    name: 'contentInfo',
    initialState,
    reducers: {
        addContentInfo: (state, action: PayloadAction<ContentInfo>) => {
            if (state.contentInfo) {
                state.contentInfo.push(action.payload);
            }
        },
        
        setContentInfo: (state, action: PayloadAction<ContentInfo[]>) => {
            state.contentInfo = action.payload;
        },

        removeContentInfo: (state) => {
            state.contentInfo = [];
        },
        
        updateContentInfo: (state, action: PayloadAction<Partial<ContentInfo>>) => {
            if (state.contentInfo) {
                const index = state.contentInfo.findIndex(info => info.id === action.payload.id);
                if (index !== -1) {
                    state.contentInfo[index] = { ...state.contentInfo[index], ...action.payload };
                }
            }
        },
    },
});

// 액션과 리듀서 export
export const { addContentInfo, setContentInfo, removeContentInfo, updateContentInfo } = contentInfoSlice.actions;
export default contentInfoSlice.reducer;
