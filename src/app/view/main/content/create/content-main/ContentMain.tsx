import React, {useRef, useEffect, useState, useCallback, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

import styles from './ContentMain.module.css';

// 항상 보여지는 컴포넌트
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';
import ContentBottom from './ContentBottom';

// 상황에 따라 나타나는 컴포넌트
import ContentPreviewChat from './content-preview-chat/ContentPreviewChat';
import ContentPublishing from './content-publishing/ContentPublishing';
import ContentDashboard from './content-dashboard/ContentDashboard';
import ChapterBoard from './chapter/ChapterBoard';

// 네트워크
import {
  sendContentSave,
  SaveContentReq,
  GetTotalContentByIdReq,
  sendContentByIdGetTotal,
  GetContentsByUserIdReq,
  sendContentByUserIdGet,
} from '@/app/NetWork/ContentNetwork';

// Redux Import
import {
  setSelectedContentId,
  setSelectedChapterIdx,
  setSelectedEpisodeIdx,
} from '@/redux-store/slices/ContentSelection';
import {setEditingContentInfo, updateEditingContentInfo} from '@/redux-store/slices/ContentInfo';
import {setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {setPublishInfo, setContentName} from '@/redux-store/slices/PublishInfo';

// Interface
import {ContentInfo, ChapterInfo} from '@/redux-store/slices/ContentInfo';
import {EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {ContentDashboardItem, setContentDashboardList} from '@/redux-store/slices/MyContentDashboard';

// Json
import EmptyContentInfo from '@/data/create/empty-content-info-data.json';

const ContentMain: React.FC = () => {
  const dispatch = useDispatch();

  // 컴포넌트 오픈 상태
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isChapterboardOpen, setIsChapterboardOpen] = useState(false);
  const [isLLMOpen, setIsLLMOpen] = useState(false);
  const [isPublishingOpen, setIsPublishingOpen] = useState(false);

  // Redux Selector
  // 자주 렌더링 되거나 독립적이지 않을 때 버그가 발생하면 개별선언
  const editingContentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo); // 현재 수정중인 컨텐츠 정보
  const selectedContentId = useSelector((state: RootState) => state.contentselection.selectedContentId); // ChapterBoard에서 선택된 ContentId
  const selectedChapterIdx = useSelector((state: RootState) => state.contentselection.selectedChapterIdx); // ChapterBoard에서 선택된 ChapterId
  const selectedEpisodeIdx = useSelector((state: RootState) => state.contentselection.selectedEpisodeIdx); // ChapterBoard에서 선택된 EpisodeId
  const contentName = useSelector((state: RootState) => state.publish.contentName);

  // 자주 렌더링 되지 않는 경우는 묶어서
  const {
    editedPublishInfo, // 저장하기 전에 수정사항을 올려놓는 PublishInfo 정보
    editedEpisodeInfo, // 저장하기 전에 수정사항을 올려놓는 EpisodeInfo 정보
  } = useSelector((state: RootState) => ({
    editedPublishInfo: state.publish,
    editedEpisodeInfo: state.episode,
  }));

  // 이전에 로드된 selectedChapter와 selectedEpisode를 저장하기 위한 ref
  const prevChapterRef = useRef<number | null>(null);
  const prevEpisodeRef = useRef<number | null>(null);

  const emptyContentInfo: ContentInfo = EmptyContentInfo.data.contentInfo as ContentInfo;
  const defaultSaveContentReq = (): SaveContentReq => ({
    contentInfo: editingContentInfo ?? emptyContentInfo,
  });

  const [loading, setLoading] = useState(false);

  function Init() {
    dispatch(setSelectedContentId(emptyContentInfo.id));
    dispatch(setSelectedChapterIdx(0));
    dispatch(setSelectedEpisodeIdx(0));
    dispatch(setEditingContentInfo(emptyContentInfo));
    dispatch(setPublishInfo(emptyContentInfo.publishInfo));
    dispatch(setCurrentEpisodeInfo(emptyContentInfo.chapterInfoList[0].episodeInfoList[0]));

    getContentsByUserId();
  }

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  //#region  서버에서 컨텐츠 가져오기
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
      const req: GetTotalContentByIdReq = {contentId: contentId};
      const response = await sendContentByIdGetTotal(req);

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

  //#endregion

  //#region ChapterBoard에서 정보 수정
  function setCurEpisodeInfo() {
    try {
      // console.log(`chap ${selectedChapterIdx}, epi ${selectedEpisodeIdx}`);

      const chapter = editingContentInfo.chapterInfoList?.[selectedChapterIdx];
      const episode = chapter?.episodeInfoList?.[selectedEpisodeIdx];

      if (!chapter || !episode) {
        throw new Error('Invalid chapter or episode selection');
      }

      dispatch(
        setCurrentEpisodeInfo(
          editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx],
        ),
      );
    } catch (error) {
      console.error('Error setting episode info:', error);
      alert('plz select episode');
    }
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
    if (editingContentInfo.chapterInfoList.length > 0) {
      const updatedChapterList = editingContentInfo.chapterInfoList.map(chapter => ({
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
  }, [selectedContentId, dispatch]);

  const handleAddChapter = (newChapter: ChapterInfo) => {
    const updatedChapterList = [
      ...editingContentInfo.chapterInfoList,
      {
        ...newChapter,
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
  };

  const handleDeleteChapter = (chapterIdx: number) => {
    const updatedChapterList = editingContentInfo.chapterInfoList.filter(
      (_, index) => index !== chapterIdx, // chapterIdx 인덱스 번호 지우기
    );

    dispatch(
      updateEditingContentInfo({
        id: selectedContentId,
        chapterInfoList: updatedChapterList,
      }),
    );

    // 삭제한 챕터가 선택된 챕터라면 바로 위 챕터를 선택
    if (selectedChapterIdx === chapterIdx) {
      dispatch(setSelectedEpisodeIdx(0));
      dispatch(setSelectedChapterIdx(chapterIdx - 1));
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
      const updatedEpisodeList = editingContentInfo.chapterInfoList[chapterIdx].episodeInfoList.filter(
        (_, index) => index !== episodeIdx, // episodeIdx 번호로 찾아서 지우기
      );

      const updatedChapter = {
        ...editingContentInfo.chapterInfoList[chapterIdx],
        episodeInfoList: updatedEpisodeList,
      };

      // 선택된 에피소드가 삭제된 경우, 바로 위 에피소드를 선택
      if (selectedEpisodeIdx === episodeIdx) {
        dispatch(setSelectedEpisodeIdx(episodeIdx - 1));
        dispatch(setCurrentEpisodeInfo(editingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[0]));
      }

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
    }
  };

  const handleNameChange = useCallback(
    (contentInfo: ContentInfo) => {
      dispatch(
        setCurrentEpisodeInfo(contentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx]),
      );
    },
    [editingContentInfo, selectedChapterIdx, selectedEpisodeIdx],
  );

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
    setIsChapterboardOpen(false);
  };

  const handleOpenLLM = () => {
    setIsLLMOpen(true);
  };
  const handleCloseLLM = () => {
    setIsLLMOpen(false);
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

  // ChapterBoard를 열면 Episode 수정을 완료했다고 판단해서 현재까지 수정한 정보를 저장함
  useEffect(() => {
    if (isChapterboardOpen) {
      saveEpisodeData();
    }
  }, [isChapterboardOpen]);
  // null인 string 값을 빈 문자열로 처리하는 함수
  const sanitizeStringFields = (obj: any, seen: Set<any> = new Set()): any => {
    // 객체가 null 또는 undefined인 경우, 빈 문자열 반환
    if (obj === null || obj === undefined) {
      return '';
    }

    // 순환 참조를 방지하기 위해 이미 처리한 객체를 확인
    if (seen.has(obj)) {
      return obj; // 순환 참조가 발생하면, 원래 객체 그대로 반환
    }

    // 배열인 경우, 배열 내부의 요소들을 재귀적으로 처리
    if (Array.isArray(obj)) {
      seen.add(obj); // 배열을 순회하기 전에 추가하여 순환 참조를 방지
      return obj.map(item => sanitizeStringFields(item, seen));
    }

    // 객체인 경우, 객체의 모든 key를 순회하며 재귀적으로 처리
    if (typeof obj === 'object') {
      seen.add(obj); // 객체를 순회하기 전에 추가하여 순환 참조를 방지
      const sanitizedObj: any = {};
      Object.keys(obj).forEach(key => {
        sanitizedObj[key] = sanitizeStringFields(obj[key], seen);
      });
      return sanitizedObj;
    }

    // 그 외의 타입은 그대로 반환
    return obj;
  };

  const handlePublish = async () => {
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
      ...sanitizeStringFields(editingContentInfo),
      userId: userId,
      publishInfo: sanitizeStringFields(editedPublishInfo), // editedPublishInfo의 null 값 처리
    };

    const tmp: SaveContentReq = {
      contentInfo: updatedContent,
    };

    setSaveData(tmp);

    try {
      const result = await sendContentSave(tmp);
      // console.log('Content saved successfully!');
      handleClosePublishing();
      Init();
    } catch (error) {
      console.error('Error sending save content data:', error);

      // 실패 메시지
      console.log('Failed to save content. Please try again.');
    }
  };
  //#endregion

  //#region 에피소드 세이브 로드
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
      console.error('Chapter not found with id:', selectedEpisodeIdx);
    }
  }

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
  //#endregion

  // 컨텐츠 타이틀
  const handleTitleChange = (newTitle: string) => {
    dispatch(setContentName(newTitle));
  };

  // 챕터, 에피소드 선택에 따라 수정할 에피소드 변경
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

  return (
    <>
      <main className={styles.contentMain}>
        <ContentHeader
          contentTitle={contentName}
          onOpenDrawer={handleOpenDashboard}
          onTitleChange={handleTitleChange} // Redux 상태 업데이트
        />
        <div className={styles.content}>
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
          <ContentPublishing
            open={isPublishingOpen}
            onClose={handleClosePublishing}
            onPublish={handlePublish}
            tagList={editingContentInfo?.publishInfo?.tagList}
          />
          <EpisodeSetup
            onDrawerOpen={handleOpenChapterboard}
            contentId={editingContentInfo?.id ?? 0}
            chapterIdx={selectedChapterIdx}
            episodeIdx={selectedEpisodeIdx}
          />
        </div>
        <ContentBottom onLLMOpen={handleOpenLLM} onPublishingOpen={handleOpenPublishing} />
      </main>
    </>
  );
};

export default ContentMain;
