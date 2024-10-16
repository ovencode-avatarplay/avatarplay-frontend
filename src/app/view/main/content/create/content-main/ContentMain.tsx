import React, {useRef, useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

import Style from './ContentMain.module.css';

// 디버그용 컴포넌트
import ContentInfoManager from './ContentInfoManager';

// 항상 보여지는 컴포넌트
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';
import ContentBottom from './ContentBottom';

// 상황에 따라 나타나는 컴포넌트
import ContentGimmick from './content-gimmick/ContentGimmick';
import ContentPreviewChat from './content-preview-chat/ContentPreviewChat';
import ContentPublishing from './content-publishing/ContentPublishing';
import ContentDashboard from './content-dashboard/ContentDashboard';
import ChapterBoard from './chapter/ChapterBoard';

// 네트워크
import {sendContentSave, SaveContentReq, GetContentReq, sendContentGet} from '@/app/NetWork/ContentNetwork';

// Redux
import {setSelectedChapter, setSelectedEpisode, setContentID} from '@/redux-store/slices/ContentSelection';
import {setContentInfo, updateContentInfo} from '@/redux-store/slices/ContentInfo';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';

// Interface
import {ContentInfo} from '@/types/apps/content/contentInfo';
import {ChapterInfo} from '@/types/apps/content/chapter/chapterInfo';

// Json
import DefaultContentInfo from '@/data/create/content-info-data.json';
import {EpisodeInfo} from '@/types/apps/content/episode/episodeInfo';

const ContentMain: React.FC = () => {
  const dispatch = useDispatch();

  // 컴포넌트 오픈 상태
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isChapterboardOpen, setIsChapterboardOpen] = useState(false);
  const [isGimmickOpen, setIsGimmickOpen] = useState(false);
  const [isPublishingOpen, setIsPublishingOpen] = useState(false);

  // Redux
  const {
    contentInfo,
    selectedChapter,
    selectedEpisode,
    contentID,
    editedChapterBoard,
    editedPublishInfo,
    editedEpisode,
  } = useSelector((state: RootState) => ({
    contentInfo: state.content.contentInfo ?? [],
    selectedChapter: state.contentselection.selectedChapter,
    selectedEpisode: state.contentselection.selectedEpisode,
    contentID: state.contentselection.contentID,
    editedChapterBoard: state.chapterBoard.chapterBoard,
    editedPublishInfo: state.publish,
    editedEpisode: state.episode,
  }));

  // 이전에 로드된 selectedChapter와 selectedEpisode를 저장하기 위한 ref
  const prevChapterRef = useRef<number | null>(null);
  const prevEpisodeRef = useRef<number | null>(null);

  const defaultContentInfo: ContentInfo = DefaultContentInfo.data.contentInfo as ContentInfo;
  const curContent = contentInfo.find(item => item.id === Number(contentID)) ?? defaultContentInfo;

  const [targetContent, setTargetContent] = useState<ContentInfo>({...curContent});

  const [loading, setLoading] = useState(false);

  const fetchAndSetContentInfo = async () => {
    setLoading(true);

    try {
      const contentIds = [42, 41, 36, 37];
      const contentPromises = contentIds.map(async id => {
        const req: GetContentReq = {contentId: id};
        const response = await sendContentGet(req);

        if (response?.data) {
          const tmp: ContentInfo = {
            id: id, // 컨텐츠 ID
            userId: id, // TODO 만든 사람의 ID 또는 사용자의 ID
            publishInfo: response.data.publishInfo,
            chapterInfoList: response.data.chapterInfoList,
          };
          return tmp;
        } else {
          throw new Error(`No contentInfo in response for ID: ${id}`);
        }
      });

      const contentData: ContentInfo[] = await Promise.all(contentPromises);
      dispatch(setContentInfo(contentData));
    } catch (error) {
      console.error('Error fetching content info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetContentInfo();
  }, []);

  useEffect(() => {
    setTargetContent(curContent);
  }, [contentID]);

  useEffect(() => {
    if (isChapterboardOpen) {
      saveEpisodeData();
    }
  }, [isChapterboardOpen, selectedChapter, selectedEpisode, editedEpisode]);

  // chapterBoard가 변경될 때 episodeInfoList를 반영
  useEffect(() => {
    if (editedChapterBoard.length > 0) {
      const updatedChapterList = editedChapterBoard.map(chapter => ({
        ...chapter,
        episodeInfoList: chapter.episodeInfoList,
      }));

      // contentInfo 상태 업데이트
      dispatch(
        updateContentInfo({
          id: contentID,
          chapterInfoList: updatedChapterList,
        }),
      );
    }
  }, [editedChapterBoard, contentID, dispatch]);

  const handleAddChapter = (newChapter: ChapterInfo) => {
    const updatedChapterList = [
      ...targetContent.chapterInfoList,
      {
        ...newChapter,
        episodeInfoList: [defaultContentInfo.chapterInfoList[0].episodeInfoList[0]], // 기본 에피소드 추가
      },
    ];

    setTargetContent(prevContent => ({
      ...prevContent,
      chapterInfoList: updatedChapterList,
    }));

    dispatch(
      updateContentInfo({
        ...targetContent,
        chapterInfoList: updatedChapterList,
      }),
    );

    // 새 챕터 추가 후 선택된 챕터와 에피소드를 업데이트
    const newSelectedChapterId = newChapter.id;
    dispatch(setSelectedChapter(newSelectedChapterId));
    dispatch(setSelectedEpisode(1));
  };

  const handleDeleteChapter = (chapterId: number) => {
    const updatedChapterList = targetContent.chapterInfoList.filter(chapter => chapter.id !== chapterId);
    setTargetContent(prevContent => ({
      ...prevContent,
      chapterInfoList: updatedChapterList,
    }));

    dispatch(
      updateContentInfo({
        id: contentID,
        chapterInfoList: updatedChapterList,
      }),
    );

    // 삭제한 챕터가 선택된 챕터라면 첫 번째 챕터를 선택
    if (selectedChapter === chapterId) {
      const remainingChapters = targetContent.chapterInfoList.filter(chapter => chapter.id !== chapterId);
      if (remainingChapters.length > 0) {
        dispatch(setSelectedChapter(remainingChapters[0].id));
        dispatch(setSelectedEpisode(remainingChapters[0].episodeInfoList[0]?.id || 0)); // 새 에피소드 선택
      } else {
        dispatch(setSelectedChapter(0)); // 남은 챕터가 없다면 0으로 설정
        dispatch(setSelectedEpisode(0)); // 에피소드도 0으로 설정
      }
    }
  };

  const handleAddEpisode = (newEpisode: EpisodeInfo) => {
    const chapterIndex = targetContent.chapterInfoList.findIndex(chapter => chapter.id === selectedChapter);
    if (chapterIndex !== -1) {
      const updatedChapter = {
        ...targetContent.chapterInfoList[chapterIndex],
        episodeInfoList: [...targetContent.chapterInfoList[chapterIndex].episodeInfoList, newEpisode],
      };

      const updatedChapterList = [
        ...targetContent.chapterInfoList.slice(0, chapterIndex),
        updatedChapter,
        ...targetContent.chapterInfoList.slice(chapterIndex + 1),
      ];

      setTargetContent(prevContent => ({
        ...prevContent,
        chapterInfoList: updatedChapterList,
      }));

      dispatch(
        updateContentInfo({
          id: contentID,
          chapterInfoList: updatedChapterList,
        }),
      );
      dispatch(setSelectedEpisode(newEpisode.id));
    }
  };

  const handleDeleteEpisode = (chapterId: number, episodeId: number) => {
    const chapterIndex = targetContent.chapterInfoList.findIndex(chapter => chapter.id === chapterId);
    if (chapterIndex !== -1) {
      const updatedEpisodeList = targetContent.chapterInfoList[chapterIndex].episodeInfoList.filter(
        episode => episode.id !== episodeId,
      );
      const updatedChapter = {
        ...targetContent.chapterInfoList[chapterIndex],
        episodeInfoList: updatedEpisodeList,
      };

      const updatedChapterList = [
        ...targetContent.chapterInfoList.slice(0, chapterIndex),
        updatedChapter,
        ...targetContent.chapterInfoList.slice(chapterIndex + 1),
      ];

      setTargetContent(prevContent => ({
        ...prevContent,
        chapterInfoList: updatedChapterList,
      }));

      dispatch(
        updateContentInfo({
          id: contentID,
          chapterInfoList: updatedChapterList,
        }),
      );

      // 선택된 에피소드가 삭제된 경우, 첫 번째 에피소드를 선택
      if (selectedEpisode === episodeId) {
        dispatch(setSelectedEpisode(0)); // 새 에피소드를 선택
      }
    }
  };

  const handleOpenDashboard = useCallback(() => {
    setIsDashboardOpen(true);
  }, []);

  const handleCloseDashboard = useCallback(() => {
    setIsDashboardOpen(false);
  }, []);

  const handleOpenChapterboard = () => {
    setIsChapterboardOpen(true);
  };
  const handleCloseChapterboard = () => {
    setIsChapterboardOpen(false);
  };

  const handleOpenGimmick = () => {
    setIsGimmickOpen(true);
  };
  const handleCloseGimmick = () => {
    setIsGimmickOpen(false);
  };

  const defaultSaveContentReq = (): SaveContentReq => ({
    contentInfo: curContent ?? defaultContentInfo,
  });

  const [saveData, setSaveData] = useState<SaveContentReq>(defaultSaveContentReq);

  const handleOpenPublishing = () => {
    setIsPublishingOpen(true);
  };

  const handleClosePublishing = () => {
    setIsPublishingOpen(false);
  };

  const handlePublish = () => {
    if (!curContent) {
      console.error('No content selected.');
      return;
    }

    if (!editedPublishInfo) {
      console.error('No editedPublishInfo available.');
      return;
    }

    saveEpisodeData();

    const updatedContent = {
      ...targetContent,
      publishInfo: {...editedPublishInfo},
    };

    const tmp: SaveContentReq = {
      contentInfo: updatedContent,
    };

    setSaveData(tmp);
    sendContentSave(tmp);
  };

  const handleItemSelect = (id: number) => {
    dispatch(setContentID(id));

    const content = contentInfo.find(item => item.id === id);

    if (content) {
      if (id < 0) {
        console.error('Invalid content ID:', id);
        return;
      }
      const chapterInfoList = content.chapterInfoList;

      if (!chapterInfoList || chapterInfoList.length === 0) {
        console.error('No chapters available for content ID:', id);
        return;
      }

      let firstChapter = chapterInfoList[0].id;
      dispatch(setSelectedChapter(firstChapter));

      let firstEpisode = chapterInfoList[0].episodeInfoList[0]?.id; // Ensure episodes are available
      if (firstEpisode) {
        dispatch(setSelectedEpisode(firstEpisode));
      } else {
        console.error('No episodes available for the first chapter of content ID:', id);
      }
    }
  };

  // 에피소드 로드
  const loadEpisodeData = () => {
    // const chapter = targetContent.chapterInfoList.find(chapter => chapter.id === selectedChapter);
    const chapter = targetContent.chapterInfoList[selectedChapter];

    if (chapter) {
      // const episode = chapter.episodeInfoList.find(episode => episode.id === selectedEpisode);
      const episode = chapter.episodeInfoList[selectedEpisode];
      if (episode) {
        dispatch(setCurrentEpisodeInfo(episode));
      } else {
        console.error('Episode not found with id:', selectedEpisode);
      }
    } else {
      console.error('Chapter not found with id:', selectedChapter);
    }
  };

  useEffect(() => {
    if (selectedChapter !== prevChapterRef.current || selectedEpisode !== prevEpisodeRef.current) {
      if (selectedChapter !== null && selectedEpisode !== null) {
        loadEpisodeData();
        prevChapterRef.current = selectedChapter;
        prevEpisodeRef.current = selectedEpisode;
      }
    }
  }, [selectedChapter, selectedEpisode]);

  function saveEpisodeData() {
    // selectedChapter와 일치하는 챕터를 찾기
    const chapterIndex = targetContent.chapterInfoList.findIndex(chapter => chapter.id === selectedChapter);

    if (chapterIndex !== -1) {
      const chapter = targetContent.chapterInfoList[chapterIndex];

      // selectedEpisode와 일치하는 에피소드를 찾기
      const episodeIndex = chapter.episodeInfoList.findIndex(episode => episode.id === selectedEpisode);

      if (episodeIndex !== -1) {
        const updatedEpisodeList = [
          ...chapter.episodeInfoList.slice(0, episodeIndex),
          {...editedEpisode.currentEpisodeInfo},
          ...chapter.episodeInfoList.slice(episodeIndex + 1),
        ];

        const updatedChapter = {
          ...chapter,
          episodeInfoList: updatedEpisodeList,
        };

        // chapterInfoList 배열도 불변성을 유지하면서 새로운 배열로 업데이트
        const updatedChapterList = [
          ...targetContent.chapterInfoList.slice(0, chapterIndex),
          updatedChapter,
          ...targetContent.chapterInfoList.slice(chapterIndex + 1),
        ];

        setTargetContent(prevContent => ({
          ...prevContent,
          chapterInfoList: updatedChapterList,
        }));

        dispatch(
          updateContentInfo({
            id: contentID,
            chapterInfoList: updatedChapterList,
          }),
        );
      } else {
        console.error('Episode not found with id:', selectedEpisode);
      }
    } else {
      console.error('Chapter not found with id:', selectedChapter);
    }
  }

  return (
    <>
      <main className={Style.contentMain}>
        {/* <ContentInfoManager />
                <p>curContentId {curContent?.id}</p>
                <p>curChapterId {selectedChapter}</p>
                <p>curEpisodeId {selectedEpisode}</p> */}
        <ContentHeader contentTitle={curContent?.publishInfo.contentName ?? ''} onOpenDrawer={handleOpenDashboard} />
        <div className={Style.content}>
          <EpisodeSetup
            onDrawerOpen={handleOpenChapterboard}
            contentId={curContent?.id ?? 0}
            chapterId={selectedChapter}
            episodeId={selectedEpisode}
          />

          <ContentDashboard open={isDashboardOpen} onClose={handleCloseDashboard} onSelectItem={handleItemSelect} />
          <ChapterBoard
            open={isChapterboardOpen}
            onClose={handleCloseChapterboard}
            initialChapters={curContent?.chapterInfoList || []}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onAddEpisode={handleAddEpisode}
            onDeleteEpisode={handleDeleteEpisode}
          />
          <ContentGimmick open={isGimmickOpen} onClose={handleCloseGimmick} />
          <ContentPreviewChat />
          <ContentPublishing
            open={isPublishingOpen}
            onClose={handleClosePublishing}
            onPublish={handlePublish}
            contentTag={curContent.publishInfo.contentTag}
          />
        </div>
        <ContentBottom onGimmickOpen={handleOpenGimmick} onPublishingOpen={handleOpenPublishing} />
      </main>
    </>
  );
};

export default ContentMain;
