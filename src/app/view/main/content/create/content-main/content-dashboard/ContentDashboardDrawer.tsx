import React, {useEffect, useRef, useState} from 'react';

import {Drawer, Box, Button, Select, MenuItem} from '@mui/material';
import styles from './ContentDashboardDrawer.module.css';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {ContentInfo, setContentInfoToEmpty} from '@/redux-store/slices/ContentInfo';
import {setEpisodeInfoEmpty} from '@/redux-store/slices/EpisodeInfo';
import {
  setSelectedChapterIdx,
  setSelectedContentId,
  setSelectedEpisodeIdx,
} from '@/redux-store/slices/ContentSelection';
import {setPublishInfo} from '@/redux-store/slices/PublishInfo';

import {sendContentDelete} from '@/app/NetWork/ContentNetwork';

import ContentDashboardList from './ContentDashboardList';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

import EmptyContentInfo from '@/data/create/empty-content-info-data.json';
import ConfirmationDialog from '@/components/layout/shared/ConfirmationDialog';
import ContentDashboardHeader from './ContentDashboardHeader';
import {BoldArrowDown} from '@ui/Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectItem: (id: number) => void;
  onRefreshItem: () => void;
}

const ContentDashboardDrawer: React.FC<Props> = ({open, onClose, onSelectItem, onRefreshItem}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const contentInfo = useSelector((state: RootState) => state.myContents.contentDashBoardList ?? []);
  const dispatch = useDispatch();
  const emptyContentInfo: ContentInfo = EmptyContentInfo.data.contentInfo as ContentInfo;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (selectedIndex !== null && open && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    }
  }, [selectedIndex, open]);

  //#region Handle
  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };
  const handleEditClick = async () => {
    if (selectedIndex !== null) {
      const selectedItemId = contentInfo[selectedIndex]?.id;
      if (selectedItemId) {
        try {
          // 비동기 호출이 5초 이상 걸리면 에러를 던지기 위한 타이머 설정
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Loading took too long!')), 5000),
          );

          await Promise.race([onSelectItem(selectedItemId), timeout]);
          onClose();
        } catch (error) {
          console.log('error');
        }
      }
    } else {
      onClose();
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  useEffect(() => {
    if (confirmed) {
      handleDeleteClick();
      setDialogOpen(false);
      setConfirmed(false);
    }
  }, [confirmed]);

  const handleDeleteClick = async () => {
    if (selectedIndex !== null) {
      const selectedItemId = contentInfo[selectedIndex]?.id;
      if (selectedItemId) {
        try {
          // 콘텐츠 삭제 API 호출
          const response = await sendContentDelete({contentId: selectedItemId});

          if (response.data) {
            // console.log('삭제된 콘텐츠 ID:', response.data.contentId);

            // 삭제 후 콘텐츠 목록 새로고침
            await onRefreshItem();

            // 선택된 인덱스 초기화
            setSelectedIndex(null);
            dispatch(setContentInfoToEmpty());
            dispatch(setEpisodeInfoEmpty());
            dispatch(setSelectedContentId(0));
            dispatch(setSelectedChapterIdx(0));
            dispatch(setSelectedEpisodeIdx(0));
          }
        } catch (error) {
          console.error('콘텐츠 삭제 실패:', error);
          // 에러 처리 로직 (예: 사용자에게 알림 표시)
        }
      }
    }
  };

  const handleCreateClick = () => {
    dispatch(setContentInfoToEmpty());
    dispatch(setPublishInfo(emptyContentInfo.publishInfo));
    dispatch(setEpisodeInfoEmpty());
    dispatch(setSelectedContentId(0));
    dispatch(setSelectedChapterIdx(0));
    dispatch(setSelectedEpisodeIdx(0));

    onClose();
  };
  //#endregion

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {width: '100vw', height: '100vh', maxWidth: '402px', margin: '0 auto'},
        }}
      >
        <ContentDashboardHeader title="Story" onClose={onClose} onCreate={handleCreateClick} />
        <div className={styles.drawerContainer}>
          <div className={styles.filterContainer}>
            <div className={`${styles.filterBase} ${styles.filterPublish}`}>
              <div className={styles.filterData}>
                <div className={styles.filterName}>All</div>
                <img className={styles.filterIcon} src={BoldArrowDown.src} />
              </div>
            </div>
            <div className={`${styles.filterBase} ${styles.filterOption}`}>
              <div className={styles.filterData}>
                <div className={styles.filterName}>Alphabetically</div>
                <img className={styles.filterIcon} src={BoldArrowDown.src} />
              </div>
            </div>
          </div>

          {/* Content list */}
          <ContentDashboardList
            contentInfo={contentInfo}
            selectedIndex={selectedIndex}
            onItemSelect={handleItemClick}
          />

          {/* Action buttons */}
          <Box className={styles.buttonContainer}>
            <Button variant="outlined" onClick={handleEditClick} disabled={selectedIndex === null}>
              Edit
            </Button>
            <Button variant="outlined">Preview</Button>
            <Button variant="outlined" onClick={handleOpenDialog} disabled={selectedIndex === null}>
              Delete
            </Button>
          </Box>
        </div>
      </Drawer>

      <ConfirmationDialog
        title="Discard Content?"
        content="Data will be disappeared. Are you sure?"
        cancelText="Cancel"
        confirmText="Okay"
        open={dialogOpen}
        onConfirm={handleConfirm}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default ContentDashboardDrawer;
