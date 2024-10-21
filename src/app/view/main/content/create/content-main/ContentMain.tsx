import React, {useRef, useEffect, useState, useCallback, useLayoutEffect} from 'react';
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
import {
  sendContentSave,
  SaveContentReq,
  GetContentByIdReq,
  sendContentByIdGet,
  GetContentsByUserIdReq,
  sendContentByUserIdGet,
} from '@/app/NetWork/ContentNetwork';

// Redux
import {setSelectedChapterId, setSelectedEpisodeId, setSelectedContentId} from '@/redux-store/slices/ContentSelection';
import {setEditingContentInfo, updateEditingContentInfo} from '@/redux-store/slices/ContentInfo';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {setPublishInfo} from '@/redux-store/slices/PublishInfo';

// Interface
import {ContentInfo} from '@/types/apps/content/contentInfo';
import {ChapterInfo} from '@/types/apps/content/chapter/chapterInfo';

// Json
import DefaultContentInfo from '@/data/create/content-info-data.json';
import EmptyContentInfo from '@/data/create/empty-content-info-data.json';
import {EpisodeInfo} from '@/types/apps/content/episode/episodeInfo';
import {ContentDashboardItem, setContentDashboardList} from '@/redux-store/slices/myContentDashboard';

const ContentMain: React.FC = () => {
  const dispatch = useDispatch();

  // 컴포넌트 오픈 상태
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isChapterboardOpen, setIsChapterboardOpen] = useState(false);
  const [isGimmickOpen, setIsGimmickOpen] = useState(false);
  const [isPublishingOpen, setIsPublishingOpen] = useState(false);

  // Redux
  const {
    editingContentInfo, // 현재 수정중인 컨텐츠 정보
    selectedContentId, // ChapterBoard에서 선택된 ContentId
    selectedChapterId, // ChapterBoard에서 선택된 ChapterId
    selectedEpisodeId, // ChapterBoard에서 선택된 EpisodeId
    editedChapterBoard, // 저장하기 전에 수정사항을 올려놓는 ChapterBoard 정보
    editedPublishInfo, // 저장하기 전에 수정사항을 올려놓는 PublishInfo 정보
    editedEpisodeInfo, // 저장하기 전에 수정사항을 올려놓는 EpisodeInfo 정보
  } = useSelector((state: RootState) => ({
    editingContentInfo: state.content.curEditingContentInfo,
    selectedChapterId: state.contentselection.selectedChapterId,
    selectedEpisodeId: state.contentselection.selectedEpisodeId,
    selectedContentId: state.contentselection.selectedContentId,
    editedChapterBoard: state.chapterBoard.chapterBoard,
    editedPublishInfo: state.publish,
    editedEpisodeInfo: state.episode,
  }));

  // 이전에 로드된 selectedChapter와 selectedEpisode를 저장하기 위한 ref
  const prevChapterRef = useRef<number | null>(null);
  const prevEpisodeRef = useRef<number | null>(null);

  const defaultContentInfo: ContentInfo = DefaultContentInfo.data.contentInfo as ContentInfo;
  const emptyContentInfo: ContentInfo = EmptyContentInfo.data.contentInfo as ContentInfo;
  const curContent = editingContentInfo ?? emptyContentInfo;

  // 현재 수정 대상의 복사본을 수정함 (수정 사항이 저장하지 않았는데 반영되면 안됨)
  const [targetContent, setTargetContent] = useState<ContentInfo>({...curContent});

  const [loading, setLoading] = useState(false);

  // 현재 유저가 가진 컨텐츠를 불러오기 위함.
  const userId = useSelector((state: RootState) => state.user.userId);

  // 현재 유저가 가진 컨텐츠를 모두 가져옴 (DashBoard 에서 사용하기 위함)
  const getContentsByUserId = async () => {
    setLoading(true);

    try {
      const req: GetContentsByUserIdReq = {userId};
      const response = await sendContentByUserIdGet(req);

      if (response?.data) {
        const contentData: ContentDashboardItem[] = response.data.contentDashBoardList;
        dispatch(setContentDashboardList(contentData));
      } else {
        throw new Error(`No contentInfo in response for ID: ${userId}`);
      }
    } catch (error) {
      console.error('Error fetching content by user ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // DashBoard 에서 선택한 컨텐츠를 Id로 가져옴 (CreateContent사이클 (Chapter, Episode 편집) 에서 사용하기 위함)
  const GetContentByContentId = async (contentId: number) => {
    setLoading(true);

    try {
      const req: GetContentByIdReq = {contentId: contentId};
      const response = await sendContentByIdGet(req);

      if (response?.data) {
        const contentData: ContentInfo = response.data.contentInfo;

        // Redux 상태 업데이트
        dispatch(setEditingContentInfo(contentData));

        // 아이템 선택 처리
        handleItemSelect(contentId);
      } else {
        throw new Error(`No contentInfo in response for ID: ${contentId}`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error; // 에러를 상위로 전달
    } finally {
      setLoading(false);
    }
  };

  function Init() {
    dispatch(setSelectedContentId(emptyContentInfo.id));
    dispatch(setSelectedChapterId(emptyContentInfo.chapterInfoList[0].id));
    dispatch(setSelectedEpisodeId(emptyContentInfo.chapterInfoList[0].episodeInfoList[0].id));
    dispatch(setEditingContentInfo(emptyContentInfo));

    getContentsByUserId();
  }

  const defaultSaveContentReq = (): SaveContentReq => ({
    contentInfo: curContent ?? emptyContentInfo,
  });

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  // ContentId가 바뀌면 수정 대상을 바꿈 (개선 사항이 있을것으로 보임)
  useEffect(() => {
    setTargetContent(curContent);
  }, [selectedContentId]);

  // ChapterBoard를 열면 Episode 수정을 완료했다고 판단해서 현재까지 수정한 정보를 저장함
  useEffect(() => {
    if (isChapterboardOpen) {
      saveEpisodeData();
    }
  }, [isChapterboardOpen]);

  //#region ChapterBoard에서 정보 수정

  // ChapterBoard에서 아이템 선택
  const handleItemSelect = (id: number) => {
    dispatch(setSelectedContentId(id));

    if (editingContentInfo) {
      if (id < 0) {
        console.error('Invalid content ID:', id);
        return;
      }
      const chapterInfoList = editingContentInfo.chapterInfoList;

      if (!chapterInfoList || chapterInfoList.length === 0) {
        console.error('No chapters available for content ID:', id);
        return;
      }

      let firstChapter = chapterInfoList[0].id;
      dispatch(setSelectedChapterId(firstChapter));

      let firstEpisode = chapterInfoList[0].episodeInfoList[0]?.id;
      if (firstEpisode) {
        dispatch(setSelectedEpisodeId(firstEpisode));
      } else {
        console.error('No episodes available for the first chapter of content ID:', id);
      }
    }
  };

  // chapterBoard가 변경될 때 episodeInfoList를 반영
  useEffect(() => {
    if (editedChapterBoard.length > 0) {
      const updatedChapterList = editedChapterBoard.map(chapter => ({
        ...chapter,
        episodeInfoList: chapter.episodeInfoList,
      }));

      // contentInfo 상태 업데이트
      dispatch(
        updateEditingContentInfo({
          id: selectedContentId,
          chapterInfoList: updatedChapterList,
        }),
      );
    }
  }, [editedChapterBoard, selectedContentId, dispatch]);

  const handleAddChapter = (newChapter: ChapterInfo) => {
    const updatedChapterList = [
      ...targetContent.chapterInfoList,
      {
        ...newChapter,
        episodeInfoList: [emptyContentInfo.chapterInfoList[0].episodeInfoList[0]], // 기본 에피소드 추가
      },
    ];

    setTargetContent(prevContent => ({
      ...prevContent,
      chapterInfoList: updatedChapterList,
    }));

    dispatch(
      updateEditingContentInfo({
        ...targetContent,
        chapterInfoList: updatedChapterList,
      }),
    );

    // 새 챕터 추가 후 선택된 챕터와 에피소드를 업데이트
    const newSelectedChapterId = newChapter.id;
    dispatch(setSelectedEpisodeId(0));
    dispatch(setSelectedChapterId(newSelectedChapterId));
  };

  const handleDeleteChapter = (chapterId: number) => {
    const updatedChapterList = targetContent.chapterInfoList.filter(chapter => chapter.id !== chapterId);
    setTargetContent(prevContent => ({
      ...prevContent,
      chapterInfoList: updatedChapterList,
    }));

    dispatch(
      updateEditingContentInfo({
        id: selectedContentId,
        chapterInfoList: updatedChapterList,
      }),
    );

    // 삭제한 챕터가 선택된 챕터라면 첫 번째 챕터를 선택
    if (selectedChapterId === chapterId) {
      const remainingChapters = targetContent.chapterInfoList.filter(chapter => chapter.id !== chapterId);
      if (remainingChapters.length > 0) {
        dispatch(setSelectedChapterId(remainingChapters[0].id));
        dispatch(setSelectedEpisodeId(remainingChapters[0].episodeInfoList[0]?.id || 0)); // 새 에피소드 선택
      } else {
        // 챕터와 에피소드는 하나씩 반드시 남아있기 때문에 들어오면 에러
        dispatch(setSelectedChapterId(0));
        dispatch(setSelectedEpisodeId(0));
      }
    }
  };

  const handleAddEpisode = (newEpisode: EpisodeInfo) => {
    const chapterIndex = targetContent.chapterInfoList.findIndex(chapter => chapter.id === selectedChapterId);
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
        updateEditingContentInfo({
          id: selectedContentId,
          chapterInfoList: updatedChapterList,
        }),
      );
      dispatch(setSelectedEpisodeId(newEpisode.id));
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
        updateEditingContentInfo({
          id: selectedContentId,
          chapterInfoList: updatedChapterList,
        }),
      );

      // 선택된 에피소드가 삭제된 경우, 첫 번째 에피소드를 선택
      if (selectedEpisodeId === episodeId) {
        dispatch(setSelectedEpisodeId(0)); // 새 에피소드를 선택
      }
    }
  };
  //#endregion

  //#region Drawer, Modal Open / Close
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

  const handleOpenPublishing = () => {
    setIsPublishingOpen(true);
  };

  const handleClosePublishing = () => {
    setIsPublishingOpen(false);
  };
  //#endregion

  //#region SaveContent

  const [saveData, setSaveData] = useState<SaveContentReq>(defaultSaveContentReq);

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
    sendContentSave(saveData);
  };
  //#endregion

  // 에피소드 로드
  const loadEpisodeData = () => {
    // const chapter = targetContent.chapterInfoList.find(chapter => chapter.id === selectedChapterId);
    const chapterIndex = targetContent.chapterInfoList.findIndex(chapter => chapter.id === selectedChapterId);

    if (chapterIndex !== -1) {
      const chapter = targetContent.chapterInfoList[chapterIndex];

      const episodeIndex = chapter.episodeInfoList.findIndex(episode => episode.id === selectedEpisodeId);
      const episode = chapter.episodeInfoList[episodeIndex];
      if (episode) {
        dispatch(setCurrentEpisodeInfo(episode));
      } else {
        console.error('Episode not found with id:', selectedEpisodeId);
      }
    } else {
      console.error('Chapter not found with id:', selectedChapterId);
    }
  };

  useEffect(() => {
    if (selectedChapterId !== prevChapterRef.current || selectedEpisodeId !== prevEpisodeRef.current) {
      if (selectedChapterId !== undefined && selectedEpisodeId !== undefined) {
        loadEpisodeData();
        prevChapterRef.current = selectedChapterId;
        prevEpisodeRef.current = selectedEpisodeId;
      }
    }
  }, [selectedChapterId, selectedEpisodeId]);

  function saveEpisodeData() {
    // selectedChapter와 일치하는 챕터를 찾기
    const chapterIndex = targetContent.chapterInfoList.findIndex(chapter => chapter.id === selectedChapterId);

    if (chapterIndex !== -1) {
      const chapter = targetContent.chapterInfoList[chapterIndex];

      // selectedEpisode와 일치하는 에피소드를 찾기
      const episodeIndex = chapter.episodeInfoList.findIndex(episode => episode.id === selectedEpisodeId);

      if (episodeIndex !== -1) {
        const updatedEpisodeList = [
          ...chapter.episodeInfoList.slice(0, episodeIndex),
          {...editedEpisodeInfo.currentEpisodeInfo},
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
          updateEditingContentInfo({
            id: selectedContentId,
            chapterInfoList: updatedChapterList,
          }),
        );
      } else {
        console.error('Episode not found with id:', selectedEpisodeId);
      }
    } else {
      console.error('Chapter not found with id:', selectedChapterId);
    }
  }

  return (
    <>
      <main className={Style.contentMain}>
        {/* <ContentInfoManager />
                <p>curContentId {curContent?.id}</p>
                <p>curChapterId {selectedChapterId}</p>
                <p>curEpisodeId {selectedEpisodeId}</p> */}
        <ContentHeader contentTitle={curContent?.publishInfo?.contentName ?? ''} onOpenDrawer={handleOpenDashboard} />
        <div className={Style.content}>
          <EpisodeSetup
            onDrawerOpen={handleOpenChapterboard}
            contentId={curContent?.id ?? 0}
            chapterId={selectedChapterId}
            episodeId={selectedEpisodeId}
          />

          <ContentDashboard
            open={isDashboardOpen}
            onClose={handleCloseDashboard}
            onSelectItem={GetContentByContentId}
          />
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
            tagList={curContent?.publishInfo?.tagList}
          />
        </div>
        <ContentBottom onGimmickOpen={handleOpenGimmick} onPublishingOpen={handleOpenPublishing} />
      </main>
    </>
  );
};

export default ContentMain;
