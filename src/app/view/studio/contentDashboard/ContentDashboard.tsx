'use client';

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useDispatch} from 'react-redux';
import {ContentInfo, setContentInfoToEmpty, setEditingContentInfo} from '@/redux-store/slices/ContentInfo';
import {setCurrentEpisodeInfo, setEpisodeInfoEmpty} from '@/redux-store/slices/EpisodeInfo';
import {
  setSelectedChapterIdx,
  setSelectedContentId,
  setSelectedEpisodeIdx,
  setSkipContentInit,
} from '@/redux-store/slices/ContentSelection';
import {setPublishInfo} from '@/redux-store/slices/PublishInfo';

// Component
import StudioTopMenu from '../StudioDashboardMenu';
import ContentList from './ContentList';
import StudioFilter from '../StudioFilter';

// Styles
import styles from './ContentDashboard.module.css';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {
  GetContentsByUserIdReq,
  GetTotalContentByIdReq,
  sendContentByIdGetTotal,
  sendContentByUserIdGet,
  sendContentDelete,
} from '@/app/NetWork/ContentNetwork';
import {ContentDashboardItem, setContentDashboardList} from '@/redux-store/slices/MyContentDashboard';

import EmptyContentInfo from '@/data/create/empty-content-info-data.json';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import CustomPopup from '@/components/layout/shared/CustomPopup';

const ContentDashboard: React.FC = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const dispatch = useDispatch();

  const [selectedFilter, setSelectedFilter] = useState('filter1');

  const emptyContentInfo: ContentInfo = EmptyContentInfo.data.contentInfo as ContentInfo;

  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  function Init() {
    getContentsByUserId();
    setSelectedItemId(null);
  }
  // 현재 유저가 가진 컨텐츠를 모두 가져옴 (DashBoard 에서 사용하기 위함)
  const getContentsByUserId = async () => {
    setLoading(true);

    try {
      const req: GetContentsByUserIdReq = {};
      const response = await sendContentByUserIdGet(req);

      if (response?.data) {
        const contentData: ContentDashboardItem[] = response.data.contentDashBoardList;
        dispatch(setContentDashboardList(contentData));
      } else {
        throw new Error(`No contentInfo in response for ID: `);
      }
    } catch (error) {
      console.error('Error fetching content by user ID:', error);
    } finally {
      setLoading(false);
    }
  };

  //handle
  const handleSelectItem = (selectedItemId: number) => {
    console.log('Selected Item ID:', selectedItemId);
    setSelectedItemId(selectedItemId);
  };

  const handleEdit = async () => {
    if (selectedItemId !== null) {
      if (selectedItemId) {
        try {
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Loading took too long!')), 5000),
          );

          setLoading(true);
          await Promise.race([GetContentByContentId(selectedItemId), timeout]);

          dispatch(setSkipContentInit(true));
          dispatch(setSelectedContentId(selectedItemId));

          dispatch(setSelectedChapterIdx(0));
          dispatch(setSelectedEpisodeIdx(0));
          setLoading(false);
          const currentLang = searchParam?.get(':lang') || 'en';
          //router.push(`/${currentLang}/create/story`);
          pushLocalizedRoute('/create/story', router);
        } catch (error) {
          setLoading(false);
          console.log('error');
        }
      }
    } else {
      setLoading(false);
      const currentLang = searchParam?.get(':lang') || 'en';
      //router.push(`/${currentLang}/create/story`);
      pushLocalizedRoute('/create/story', router);
      dispatch(setSkipContentInit(false));
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirm = () => {
    setDeleteConfirmed(true);
  };

  useEffect(() => {
    if (deleteConfirmed) {
      handleDeleteClick();
      setDeleteDialogOpen(false);
      setDeleteConfirmed(false);
    }
  }, [deleteConfirmed]);

  // DashBoard 에서 선택한 컨텐츠를 Id로 가져옴 (CreateContent사이클 (Chapter, Episode 편집) 에서 사용하기 위함)
  const GetContentByContentId = async (contentId: number) => {
    setLoading(true);

    try {
      const req: GetTotalContentByIdReq = {contentId: contentId, language: navigator.language};
      const response = await sendContentByIdGetTotal(req);

      if (response?.data) {
        const contentData: ContentInfo = response.data.contentInfo;

        // Redux 상태 업데이트
        dispatch(setEditingContentInfo(contentData));

        dispatch(setCurrentEpisodeInfo(contentData.chapterInfoList[0].episodeInfoList[0]));
        dispatch(setPublishInfo(contentData.publishInfo));
      } else {
        throw new Error(`No contentInfo in response for ID: ${contentId}`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    console.log('Gallery button clicked');
  };

  const handleDeleteClick = async () => {
    if (selectedItemId !== null) {
      if (selectedItemId) {
        try {
          // 콘텐츠 삭제 API 호출
          const response = await sendContentDelete({contentId: selectedItemId});

          if (response.data) {
            // console.log('삭제된 콘텐츠 ID:', response.data.contentId);

            // 삭제 후 콘텐츠 목록 새로고침
            await getContentsByUserId();

            // 선택된 인덱스 초기화
            setSelectedItemId(null);
            dispatch(setContentInfoToEmpty());
            dispatch(setEpisodeInfoEmpty());
            dispatch(setSelectedContentId(0));
            dispatch(setSelectedChapterIdx(0));
            dispatch(setSelectedEpisodeIdx(0));
          }
        } catch (error) {
          console.error('콘텐츠 삭제 실패:', error);
        }
      }
    }
  };

  const handleFilterChange = (value: string) => {
    console.log('Selected filter:', value);
    setSelectedFilter(value);
  };

  const handleCreateClick = () => {
    dispatch(setContentInfoToEmpty());
    dispatch(setPublishInfo(emptyContentInfo.publishInfo));
    dispatch(setEpisodeInfoEmpty());
    dispatch(setSelectedContentId(0));
    dispatch(setSelectedChapterIdx(0));
    dispatch(setSelectedEpisodeIdx(0));
    const currentLang = searchParam?.get(':lang') || 'en';
    //router.push(`/${currentLang}/create/story`);
    pushLocalizedRoute('/create/story', router);
  };

  // Data
  const filters = [
    {value: 'filter1', label: 'Filter 1'},
    {value: 'filter2', label: 'Filter 2'},
    {value: 'filter3', label: 'Filter 3'},
  ];
  return (
    <>
      <div className={styles.dashboard}>
        <StudioTopMenu icon={<AutoStoriesIcon />} text="Story" />
        <StudioFilter
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onCreateClick={handleCreateClick}
        />
        <ContentList onSelect={handleSelectItem} onItemEdit={handleEdit} onItemDelete={handleOpenDeleteDialog} />
      </div>
      {deleteDialogOpen && (
        <CustomPopup
          type="alert"
          title="Discard Content?"
          description="Data will be disappeared. Are you sure?"
          buttons={[
            {label: 'Cancel', onClick: handleCloseDeleteDialog, isPrimary: false},
            {label: 'Okay', onClick: handleConfirm, isPrimary: true},
          ]}
        />
      )}

      <LoadingOverlay loading={loading} />
    </>
  );
};

export default ContentDashboard;
