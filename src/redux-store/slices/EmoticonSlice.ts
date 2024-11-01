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
  },
});

export const {updateEmoticonGroups, updateFavorite} = emoticonSlice.actions;
export default emoticonSlice.reducer;
