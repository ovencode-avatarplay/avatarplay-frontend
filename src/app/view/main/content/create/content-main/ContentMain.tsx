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
import {
  setSelectedContentId,
  setSelectedChapterIdx,
  setSelectedEpisodeIdx,
} from '@/redux-store/slices/ContentSelection';
import {setEditingContentInfo, updateEditingContentInfo} from '@/redux-store/slices/ContentInfo';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {setPublishInfo, setContentName} from '@/redux-store/slices/PublishInfo';

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
    selectedChapterIdx, // ChapterBoard에서 선택된 ChapterId
    selectedEpisodeIdx, // ChapterBoard에서 선택된 EpisodeId
    editedChapterBoard, // 저장하기 전에 수정사항을 올려놓는 ChapterBoard 정보
    editedPublishInfo, // 저장하기 전에 수정사항을 올려놓는 PublishInfo 정보
    editedEpisodeInfo, // 저장하기 전에 수정사항을 올려놓는 EpisodeInfo 정보
  } = useSelector((state: RootState) => ({
    editingContentInfo: state.content.curEditingContentInfo,
    selectedContentId: state.contentselection.selectedContentId,
    selectedChapterIdx: state.contentselection.selectedChapterIdx,
    selectedEpisodeIdx: state.contentselection.selectedEpisodeIdx,
    editedChapterBoard: state.chapterBoard.chapterBoard,
    editedPublishInfo: state.publish,
    editedEpisodeInfo: state.episode,
  }));

  // 이전에 로드된 selectedChapter와 selectedEpisode를 저장하기 위한 ref
  const prevChapterRef = useRef<number | null>(null);
  const prevEpisodeRef = useRef<number | null>(null);

  const defaultContentInfo: ContentInfo = DefaultContentInfo.data.contentInfo as ContentInfo;
  const emptyContentInfo: ContentInfo = EmptyContentInfo.data.contentInfo as ContentInfo;

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

        dispatch(setCurrentEpisodeInfo(contentData.chapterInfoList[0].episodeInfoList[0]));
        dispatch(setPublishInfo(contentData.publishInfo));
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
    dispatch(setSelectedChapterIdx(0));
    dispatch(setSelectedEpisodeIdx(0));
    dispatch(setEditingContentInfo(emptyContentInfo));
    dispatch(setPublishInfo(emptyContentInfo.publishInfo));

    getContentsByUserId();
  }

  const defaultSaveContentReq = (): SaveContentReq => ({
    contentInfo: editingContentInfo ?? emptyContentInfo,
  });

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  // ChapterBoard를 열면 Episode 수정을 완료했다고 판단해서 현재까지 수정한 정보를 저장함
  useEffect(() => {
    if (isChapterboardOpen) {
      saveEpisodeData();
    }
  }, [isChapterboardOpen]);

  //#region ChapterBoard에서 정보 수정
  function setCurEpisodeInfo() {
    dispatch(
      setCurrentEpisodeInfo(editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx]),
    );
  }

  // ChapterBoard에서 아이템 선택
  const handleItemSelect = (contentIdx: number) => {
    dispatch(setSelectedContentId(contentIdx));

    if (editingContentInfo) {
      const chapterInfoList = editingContentInfo.chapterInfoList;

      if (!chapterInfoList || chapterInfoList.length === 0) {
        console.error('No chapters available for content with idx:', contentIdx);
        return;
      }

      dispatch(setSelectedChapterIdx(0));
      if (chapterInfoList[0].episodeInfoList.length > 0) {
        dispatch(setSelectedEpisodeIdx(0));
      } else {
        console.error('No episodes available for the first chapter of content with idx:', contentIdx);
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
      ...editingContentInfo.chapterInfoList,
      {
        ...newChapter,
        episodeInfoList: [emptyContentInfo.chapterInfoList[0].episodeInfoList[0]], // 기본 에피소드 추가
      },
    ];

    dispatch(
      updateEditingContentInfo({
        ...editingContentInfo,
        chapterInfoList: updatedChapterList,
      }),
    );

    // 새 챕터 추가 후 선택된 챕터와 에피소드를 업데이트
    dispatch(setSelectedEpisodeIdx(0));
    dispatch(setSelectedChapterIdx(editingContentInfo.chapterInfoList.length));

    setCurEpisodeInfo();
  };

  const handleDeleteChapter = (chapterIdx: number) => {
    const updatedChapterList = editingContentInfo.chapterInfoList;

    dispatch(
      updateEditingContentInfo({
        id: selectedContentId,
        chapterInfoList: updatedChapterList,
      }),
    );

    // 삭제한 챕터가 선택된 챕터라면 첫 번째 챕터를 선택
    if (selectedChapterIdx === chapterIdx) {
      dispatch(setSelectedChapterIdx(0));
      dispatch(setSelectedEpisodeIdx(0));

      setCurEpisodeInfo();
    }
  };

  const handleAddEpisode = (newEpisode: EpisodeInfo) => {
    if (selectedChapterIdx !== -1) {
      const updatedChapter = {
        ...editingContentInfo.chapterInfoList[selectedChapterIdx],
        episodeInfoList: [...editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList, newEpisode],
      };

      const updatedChapterList = [
        ...editingContentInfo.chapterInfoList.slice(0, selectedChapterIdx),
        updatedChapter,
        ...editingContentInfo.chapterInfoList.slice(selectedChapterIdx + 1),
      ];

      dispatch(
        updateEditingContentInfo({
          id: selectedContentId,
          chapterInfoList: updatedChapterList,
        }),
      );
      dispatch(setSelectedEpisodeIdx(updatedChapter.episodeInfoList.length - 1));

      setCurEpisodeInfo();
    }
  };

  const handleDeleteEpisode = (chapterIdx: number, episodeIdx: number) => {
    if (chapterIdx !== -1) {
      const updatedEpisodeList = editingContentInfo.chapterInfoList[chapterIdx].episodeInfoList;

      const updatedChapter = {
        ...editingContentInfo.chapterInfoList[chapterIdx],
        episodeInfoList: updatedEpisodeList,
      };

      const updatedChapterList = [
        ...editingContentInfo.chapterInfoList.slice(0, chapterIdx),
        updatedChapter,
        ...editingContentInfo.chapterInfoList.slice(chapterIdx + 1),
      ];

      dispatch(
        updateEditingContentInfo({
          id: selectedContentId,
          chapterInfoList: updatedChapterList,
        }),
      );

      // 선택된 에피소드가 삭제된 경우, 첫 번째 에피소드를 선택
      if (selectedEpisodeIdx === episodeIdx) {
        dispatch(setSelectedEpisodeIdx(0));

        setCurEpisodeInfo();
      }
    }
  };

  const handleNameChange = () => {
    setCurEpisodeInfo();
  };

  //#endregion

  //#region Drawer, Modal Open / Close
  const handleOpenDashboard = useCallback(() => {
    getContentsByUserId();

    setIsDashboardOpen(true);
  }, []);

  const handleCloseDashboard = useCallback(() => {
    setIsDashboardOpen(false);
  }, []);

  const handleOpenChapterboard = () => {
    setIsChapterboardOpen(true);
  };
  const handleCloseChapterboard = () => {
    setCurEpisodeInfo();

    setIsChapterboardOpen(false);
  };

  const handleOpenGimmick = () => {
    setIsGimmickOpen(true);
  };
  const handleCloseGimmick = () => {
    setIsGimmickOpen(false);
  };

  const handleOpenPublishing = () => {
    saveEpisodeData();
    setIsPublishingOpen(true);
  };

  const handleClosePublishing = () => {
    setIsPublishingOpen(false);
  };
  //#endregion

  //#region SaveContent

  const [saveData, setSaveData] = useState<SaveContentReq>(defaultSaveContentReq);

  const handlePublish = () => {
    if (!editingContentInfo) {
      console.error('No content selected.');
      return;
    }

    if (!editedPublishInfo) {
      console.error('No editedPublishInfo available.');
      return;
    }

    saveEpisodeData();

    const updatedContent = {
      ...editingContentInfo,
      userId: userId,
      publishInfo: {...editedPublishInfo},
    };

    const tmp: SaveContentReq = {
      contentInfo: updatedContent,
    };

    setSaveData(tmp);
    sendContentSave(tmp);
  };
  //#endregion

  // 에피소드 로드
  const loadEpisodeData = () => {
    if (selectedChapterIdx !== -1) {
      const chapter = editingContentInfo.chapterInfoList[selectedChapterIdx];

      const episode = chapter.episodeInfoList[selectedEpisodeIdx];
      if (episode) {
        dispatch(setCurrentEpisodeInfo(episode));
      } else {
        console.error('Episode not found with idx:', selectedEpisodeIdx);
      }
    } else {
      console.error('Chapter not found with idx:', selectedChapterIdx);
    }
  };

  useEffect(() => {
    const isChapterIdxValid = selectedChapterIdx !== null && selectedChapterIdx >= 0;
    const isEpisodeIdxValid = selectedEpisodeIdx !== null && selectedEpisodeIdx >= 0;

    if (
      (selectedChapterIdx !== prevChapterRef.current || selectedEpisodeIdx !== prevEpisodeRef.current) &&
      isChapterIdxValid &&
      isEpisodeIdxValid
    ) {
      loadEpisodeData(); // 에피소드 데이터를 불러옴
      prevChapterRef.current = selectedChapterIdx;
      prevEpisodeRef.current = selectedEpisodeIdx;
    }
  }, [selectedChapterIdx, selectedEpisodeIdx]);

  function saveEpisodeData() {
    // selectedChapter와 일치하는 챕터를 찾기
    if (selectedChapterIdx !== -1) {
      const chapter = editingContentInfo.chapterInfoList[selectedChapterIdx];

      // selectedEpisode와 일치하는 에피소드를 찾기
      if (selectedEpisodeIdx !== -1) {
        const updatedEpisodeList = [
          ...chapter.episodeInfoList.slice(0, selectedEpisodeIdx),
          {...editedEpisodeInfo.currentEpisodeInfo},
          ...chapter.episodeInfoList.slice(selectedEpisodeIdx + 1),
        ];

        const updatedChapter = {
          ...chapter,
          episodeInfoList: updatedEpisodeList,
        };

        // chapterInfoList 배열도 불변성을 유지하면서 새로운 배열로 업데이트
        const updatedChapterList = [
          ...editingContentInfo.chapterInfoList.slice(0, selectedChapterIdx),
          updatedChapter,
          ...editingContentInfo.chapterInfoList.slice(selectedChapterIdx + 1),
        ];

        dispatch(
          updateEditingContentInfo({
            id: selectedContentId,
            chapterInfoList: updatedChapterList,
          }),
        );
      } else {
        console.error('Episode not found with id:', selectedEpisodeIdx);
      }
    } else {
      console.error('Chapter not found with id:', selectedChapterIdx);
    }
  }

  return (
    <>
      <main className={Style.contentMain}>
        {/* <ContentInfoManager />
                <p>curContentId {targetContent?.id}</p>
                <p>curChapterId {selectedChapterId}</p>
                <p>curEpisodeId {selectedEpisodeId}</p> */}
        <ContentHeader
          contentTitle={editingContentInfo?.publishInfo?.contentName ?? ''}
          onOpenDrawer={handleOpenDashboard}
          onTitleChange={newTitle => {
            dispatch(setContentName(newTitle)); // Redux 상태 업데이트
          }}
        />
        <div className={Style.content}>
          <EpisodeSetup
            onDrawerOpen={handleOpenChapterboard}
            contentId={editingContentInfo?.id ?? 0}
            chapterId={selectedChapterIdx}
            episodeId={selectedEpisodeIdx}
          />

          <ContentDashboard
            open={isDashboardOpen}
            onClose={handleCloseDashboard}
            onSelectItem={GetContentByContentId}
          />
          <ChapterBoard
            open={isChapterboardOpen}
            onClose={handleCloseChapterboard}
            initialChapters={editingContentInfo?.chapterInfoList || []}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onAddEpisode={handleAddEpisode}
            onDeleteEpisode={handleDeleteEpisode}
            onNameChange={handleNameChange}
          />
          <ContentGimmick open={isGimmickOpen} onClose={handleCloseGimmick} />
          <ContentPreviewChat />
          <ContentPublishing
            open={isPublishingOpen}
            onClose={handleClosePublishing}
            onPublish={handlePublish}
            tagList={editingContentInfo?.publishInfo?.tagList}
          />
        </div>
        <ContentBottom onGimmickOpen={handleOpenGimmick} onPublishingOpen={handleOpenPublishing} />
      </main>
    </>
  );
};

export default ContentMain;
