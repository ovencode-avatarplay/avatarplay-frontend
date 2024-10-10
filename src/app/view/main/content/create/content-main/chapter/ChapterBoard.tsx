import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';

// Css, MUI
import { Drawer, Box, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Style from './ChapterBoard.module.css';


// Slice
import { setSelectedChapter, setSelectedEpisode } from '@/redux-store/slices/ContentSelection';
import { addChapter, deleteChapter, addEpisode, deleteEpisode} from '@/redux-store/slices/ChapterBoard';
import { updateContentInfo } from '@/redux-store/slices/ContentInfo';


// Components
import ChapterItem from './ChapterItem';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

// Types
import { Chapter } from '@/types/apps/chapterCardType';
import { ChapterInfo } from '@/types/apps/content/chapter/chapterInfo';
import { EpisodeInfo } from '@/types/apps/content/episode/episodeInfo';

// Data
import defaultData from '@/data/create/content-info-data.json';


interface Props {
  open: boolean;
  onClose: () => void;
  initialChapters: ChapterInfo[];
  onAddChapter: (newChapter : ChapterInfo) => void;
  onDeleteChapter: (chapterId: number) => void;
  onAddEpisode: (newEpisode: EpisodeInfo) => void; 
  onDeleteEpisode: (chapterId: number, episodeId: number) => void; 

}

const ChapterBoard: React.FC<Props> = ({ open, onClose, initialChapters, onAddChapter, onDeleteChapter, onAddEpisode, onDeleteEpisode }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const curContentId = useSelector((state: RootState) => state.contentselection.contentID);
  const selectedContent = useSelector((state: RootState) => state.content.contentInfo.find(item => item.id === curContentId));
  const selectedChapter = useSelector((state: RootState) => state.contentselection.selectedChapter);
  const selectedEpisode = useSelector((state: RootState) => state.contentselection.selectedEpisode);
  const [editItem, setEditItem] = useState<{ id: number | null; type: 'chapter' | 'episode' | null }>({ id: null, type: null });
  const [newName, setNewName] = useState<string>('');
  const dispatch = useDispatch();

  const defaultChapterData = defaultData.contentInfo[0].chapterInfoList[0];
  const defaultEpisodeData = defaultChapterData.episodeInfoList[0];


  // ChapterInfo를 Chapter로 변환하는 함수
  const transformChapterInfoToChapter = (chapterInfoList: ChapterInfo[]): Chapter[] => {
    return chapterInfoList.map((chapterInfo) => ({
      id: chapterInfo.id,
      title: chapterInfo.name,
      episodes: chapterInfo.episodeInfoList.map((episodeInfo) => ({
        id: episodeInfo.id,
        title: episodeInfo.name,
        thumbnail: episodeInfo.thumbnail,
        description: episodeInfo.episodeDescription,
        triggerInfoList: episodeInfo.triggerInfoList,
        conversationTemplateList: episodeInfo.conversationTemplateList,
        llmSetupInfo: episodeInfo.llmSetupInfo,
      })),
      expanded: false, 
    }));
  };

 // ChapterInfo 배열을 컴포넌트 상태로 변환
 useEffect(() => {
  setChapters(initialChapters.map(chapterInfo => ({
    id: chapterInfo.id,
    title: chapterInfo.name,
    episodes: chapterInfo.episodeInfoList.map(episodeInfo => ({
      id: episodeInfo.id,
      title: episodeInfo.name,
      thumbnail: episodeInfo.thumbnail,
      description: episodeInfo.episodeDescription,
      triggerInfoList: episodeInfo.triggerInfoList,
      conversationTemplateList: episodeInfo.conversationTemplateList,
      llmSetupInfo: episodeInfo.llmSetupInfo
    })),
    expanded: false,
  })));
}, [initialChapters]);

//#region Chapter

  const handleChapterToggle = (chapterId: number) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter =>
        chapter.id === chapterId ? { ...chapter, expanded: !chapter.expanded } : chapter
      )
    );
  };

  const handleChapterSelect = (chapterId: number) => {
    dispatch(setSelectedChapter(chapterId));
    dispatch(setSelectedEpisode(0));
  };

  const handleCreateChapter = () => {
    const newChapter: ChapterInfo = {
        id: chapters.length + 1,
        name: 'New Chapter',
        episodeInfoList: [],
    };

    // 새로운 챕터를 ContentMain으로 전달하여 추가
    onAddChapter(newChapter);
};
const handleDeleteChapter = (chapterId: number) => {
    if (chapters.length > 1) {
        onDeleteChapter(chapterId); // Call the function passed via props
        setChapters(prevChapters => prevChapters.filter(chapter => chapter.id !== chapterId));
    }
};
//#endregion


//#region Episode

  const handleEpisodeSelect = (chapterId: number, episodeId: number) => {
    dispatch(setSelectedChapter(chapterId));
    dispatch(setSelectedEpisode(episodeId));
  };

  const handleChangeName = (id: number, type: 'chapter' | 'episode', newName: string) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) => {
        if (type === 'chapter' && chapter.id === id) {
          
          if (selectedChapter === id) {
            const updatedContent = {
              ...selectedContent,
              chapterInfoList: selectedContent?.chapterInfoList.map((chapterInfo) =>
                chapterInfo.id === id ? { ...chapterInfo, name: newName } : chapterInfo
              ),
            };
            dispatch(updateContentInfo(updatedContent)); // Redux 상태 반영
          }
          return { ...chapter, title: newName };
        } else if (type === 'episode' && selectedEpisode && chapter.id === selectedChapter) {
          
          const updatedEpisodes = chapter.episodes.map((episode) =>
            episode.id === id ? { ...episode, title: newName } : episode
          );

          if (selectedEpisode === id) {
            const updatedContent = {
              ...selectedContent,
              chapterInfoList: selectedContent?.chapterInfoList.map((chapterInfo) =>
                chapterInfo.id === selectedChapter
                  ? {
                    ...chapterInfo,
                    episodeInfoList: chapterInfo.episodeInfoList.map((episodeInfo) =>
                      episodeInfo.id === id ? { ...episodeInfo, name: newName } : episodeInfo
                    ),
                  }
                  : chapterInfo
              ),
            };

            dispatch(updateContentInfo(updatedContent));
          }

          // 에피소드 이름을 로컬 상태에도 반영
          return { ...chapter, episodes: updatedEpisodes };
        }
        return chapter;
      })
    );
  };
  
  const handleCreateEpisode = () => {
    if (selectedChapter !== null) {
        const selectedChapterData = chapters.find(chapter => chapter.id === selectedChapter);
        const newEpisodeInfo: EpisodeInfo = {
            ...defaultEpisodeData,
            id: (selectedChapterData?.episodes.length || 0) + 1,
        };

        const newEpisode = {
            id: newEpisodeInfo.id,
            title: newEpisodeInfo.name,
            thumbnail: newEpisodeInfo.thumbnail,
            description: newEpisodeInfo.episodeDescription,
            triggerInfoList: newEpisodeInfo.triggerInfoList,
            conversationTemplateList: newEpisodeInfo.conversationTemplateList,
            llmSetupInfo: newEpisodeInfo.llmSetupInfo,
        };

        onAddEpisode(newEpisodeInfo); // Call the function passed via props

        setChapters(prevChapters =>
            prevChapters.map(chapter =>
                chapter.id === selectedChapter
                    ? { ...chapter, episodes: [...chapter.episodes, newEpisode] }
                    : chapter
            )
        );
    }
};

const handleDeleteEpisode = (chapterId: number, episodeId: number) => {
    onDeleteEpisode(chapterId, episodeId); // Call the function passed via props
    setChapters(prevChapters =>
        prevChapters.map(chapter => {
            if (chapter.id === chapterId && chapter.episodes.length > 1) {
                return {
                    ...chapter,
                    episodes: chapter.episodes.filter(episode => episode.id !== episodeId),
                };
            }
            return chapter;
        })
    );
};

// const handleCreateEpisode = () => {
//   if (selectedChapter !== null) {
//     const selectedChapterData = chapters.find(chapter => chapter.id === selectedChapter);
//     const newEpisodeInfo: EpisodeInfo = {
//       ...defaultEpisodeData,
//       id: (selectedChapterData?.episodes.length || 0) + 1, // 고유 에피소드 ID 설정
//     };

//     const newEpisode = {
//       id: newEpisodeInfo.id,
//       title: newEpisodeInfo.name,
//       thumbnail: newEpisodeInfo.thumbnail,
//       description: newEpisodeInfo.episodeDescription,
//       triggerInfoList: newEpisodeInfo.triggerInfoList,
//       conversationTemplateList: newEpisodeInfo.conversationTemplateList,
//       llmSetupInfo: newEpisodeInfo.llmSetupInfo,
//     };

//     dispatch(addEpisode({ chapterId: selectedChapter, episode: newEpisodeInfo }));

//     setChapters(prevChapters =>
//       prevChapters.map(chapter =>
//         chapter.id === selectedChapter
//           ? { ...chapter, episodes: [...chapter.episodes, newEpisode] }
//           : chapter
//       )
//     );
//   }
// };

// const handleDeleteEpisode = (chapterId: number, episodeId: number) => {
//   dispatch(deleteEpisode({ chapterId, episodeId }));
//   setChapters(prevChapters =>
//     prevChapters.map(chapter => {
//       if (chapter.id === chapterId && chapter.episodes.length > 1) {
//         return {
//           ...chapter,
//           episodes: chapter.episodes.filter(episode => episode.id !== episodeId),
//         };
//       }
//       return chapter;
//     })
//   );
// };
//#endregion


  // Edit 팝업 열기
  const handleEditClick = (id: number, type: 'chapter' | 'episode') => {
    if (type === 'episode')
    {
      dispatch(setSelectedEpisode(id));
    }
    setEditItem({ id, type });
    setNewName('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '100vw', height: '100vh' },
      }}
    >
      <Box className={Style.drawerContainer}>
        {/* Drawer Header */}
        <CreateDrawerHeader title="ChapterBoard" onClose={onClose} />

        {/* Create Chapter 버튼 */}
        <Box className={Style.imageButtonContainer}>
          <Button className={Style.imageButton} onClick={handleCreateChapter}>
            <HomeIcon />
            <Typography>Create Chapter</Typography>
          </Button>
        </Box>

        {/* Chapter 및 Episode 트리 구조 */}
        <Box className={Style.contentBox}>
          {chapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              onDelete={handleDeleteChapter}
              onToggle={handleChapterToggle}
              onDeleteEpisode={handleDeleteEpisode}
              onSelect={handleChapterSelect}
              onSelectEpisode={handleEpisodeSelect}
              onEdit={handleEditClick}
              onCloseChapterBoard={onClose}
              isSelected={selectedChapter === chapter.id}
              disableDelete={chapters.length <= 1}
            />
          ))}
        </Box>

        {/* Create Episode 버튼 */}
        <Box className={Style.imageButtonContainer}>
          <Button className={Style.imageButton} onClick={handleCreateEpisode}>
            <HomeIcon />
            <Typography>Create Episode</Typography>
          </Button>
        </Box>
      </Box>

      {/* 이름 변경을 위한 Dialog */}
      <Dialog open={editItem.id !== null} onClose={() => setEditItem({ id: null, type: null })}>
        <DialogTitle>Edit {editItem.type === 'chapter' ? 'Chapter' : 'Episode'} Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem({ id: null, type: null })}>Cancel</Button>
          <Button
            onClick={() => {
              if (editItem.id && editItem.type) {
                handleChangeName(editItem.id, editItem.type, newName);
                setEditItem({ id: null, type: null }); // 에디트 상태 초기화
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default ChapterBoard;
