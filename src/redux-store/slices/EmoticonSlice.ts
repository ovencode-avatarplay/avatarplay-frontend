import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';

interface Emoticon {
  id: number;
  text: string;
  emoticonUrl: string;
  isFavorite: boolean;
}

interface EmoticonGroup {
  id: number;
  type: number;
  name: string;
  iconOffUrl: string | null;
  iconOnUrl: string | null;
  emoticonList: Emoticon[];
}

interface EmoticonState {
  emoticonGroups: EmoticonGroup[];
}

const initialState: EmoticonState = {
  emoticonGroups: [],
};

export const fetchAndUpdateEmoticonGroups = createAsyncThunk(
  'emoticon/fetchAndUpdateEmoticonGroups',
  async (emoticonGroups: EmoticonGroup[], {dispatch, getState}) => {
    const state = getState() as {emoticon: EmoticonState};
    const cachedGroups = state.emoticon.emoticonGroups;
    console.log('1111');
    const updatedGroups = await Promise.all(
      emoticonGroups.map(async (group, index) => {
        const cachedGroup = cachedGroups[index];
        if (!cachedGroup || cachedGroup.id !== group.id) {
          const updatedEmoticons = await Promise.all(
            group.emoticonList.map(async emoticon => {
              const response = await fetch(emoticon.emoticonUrl);
              const blob = await response.blob();
              const blobUrl = URL.createObjectURL(blob);
              return {...emoticon, emoticonUrl: blobUrl};
            }),
          );
          return {...group, emoticonList: updatedEmoticons};
        } else {
          const updatedEmoticons = await Promise.all(
            group.emoticonList.map(async emoticon => {
              const cachedEmoticon = cachedGroup.emoticonList.find(e => e.id === emoticon.id);

              if (!cachedEmoticon || cachedEmoticon.emoticonUrl !== emoticon.emoticonUrl) {
                const response = await fetch(emoticon.emoticonUrl);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                if (cachedEmoticon && cachedEmoticon.emoticonUrl !== emoticon.emoticonUrl) {
                  URL.revokeObjectURL(cachedEmoticon.emoticonUrl);
                }
                return {...emoticon, emoticonUrl: blobUrl};
              }

              return cachedEmoticon;
            }),
          );
          return {...group, emoticonList: updatedEmoticons};
        }
      }),
    );

    dispatch(updateEmoticonGroups(updatedGroups));
  },
);

const emoticonSlice = createSlice({
  name: 'emoticon',
  initialState,
  reducers: {
    updateEmoticonGroups(state, action: PayloadAction<EmoticonGroup[]>) {
      state.emoticonGroups = action.payload;
    },
    updateFavorite(state, action: PayloadAction<{emoticonId: number; isFavorite: boolean}>) {
      const {emoticonId, isFavorite} = action.payload;

      let favoriteGroup = state.emoticonGroups[0];

      // 즐겨찾기 추가 및 해제 로직
      if (isFavorite) {
        const newFavorite = state.emoticonGroups.flatMap(group => group.emoticonList).find(e => e.id === emoticonId);
        if (newFavorite) {
          // favoriteGroup.emoticonList가 비어있거나 null인 경우 새 이모티콘을 추가
          if (!favoriteGroup.emoticonList || favoriteGroup.emoticonList.length === 0) {
            favoriteGroup.emoticonList = [newFavorite];
          } else {
            favoriteGroup.emoticonList = [newFavorite, ...favoriteGroup.emoticonList.filter(e => e.id !== emoticonId)];
          }
        }
      } else {
        // 즐겨찾기 해제 시 해당 이모티콘 제거
        favoriteGroup.emoticonList = favoriteGroup.emoticonList.filter(emoticon => emoticon.id !== emoticonId);
      }
      console.log('1');
      // 전체 그룹에서 해당 이모티콘의 isFavorite 상태 업데이트
      state.emoticonGroups = state.emoticonGroups.map(group => ({
        ...group,
        emoticonList: group.emoticonList.map(emoticon =>
          emoticon.id === emoticonId ? {...emoticon, isFavorite} : emoticon,
        ),
      }));
    },
    updateRecent(state, action: PayloadAction<{emoticonId: number}>) {
      const {emoticonId} = action.payload;
      if (emoticonId == 0) return;
      let recentGroup = state.emoticonGroups[1];
      const newRecent = state.emoticonGroups.flatMap(group => group.emoticonList).find(e => e.id === emoticonId);

      if (newRecent) {
        // favoriteGroup.emoticonList가 비어있거나 null인 경우 새 이모티콘을 추가
        if (!recentGroup.emoticonList || recentGroup.emoticonList.length === 0) {
          recentGroup.emoticonList = [newRecent];
        } else {
          // 이미 동일한 id가 있는 경우
          const existingIndex = recentGroup.emoticonList.findIndex(e => e.id === emoticonId);
          if (existingIndex !== -1) {
            // 기존 이모티콘을 리스트에서 제거하고 맨 앞에 추가
            const existingItem = recentGroup.emoticonList[existingIndex];
            recentGroup.emoticonList.splice(existingIndex, 1); // 해당 아이템 제거
            recentGroup.emoticonList.unshift(existingItem); // 맨 앞에 추가
          } else {
            // 기존 아이템이 없다면 새로운 아이템 추가
            recentGroup.emoticonList = [newRecent, ...recentGroup.emoticonList.filter(e => e.id !== emoticonId)];
          }
        }
        console.log(recentGroup.emoticonList);
      }
    },
  },
});

export const {updateEmoticonGroups, updateRecent, updateFavorite} = emoticonSlice.actions;
export default emoticonSlice.reducer;
