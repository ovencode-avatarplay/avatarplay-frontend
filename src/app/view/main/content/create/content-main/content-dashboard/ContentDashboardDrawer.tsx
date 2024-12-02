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

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectItem: (id: number) => void;
}

const ContentDashboardDrawer: React.FC<Props> = ({open, onClose, onSelectItem}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const contentInfo = useSelector((state: RootState) => state.myContents.contentDashBoardList ?? []);
  const dispatch = useDispatch();
  const emptyContentInfo: ContentInfo = EmptyContentInfo.data.contentInfo as ContentInfo;

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
            await onSelectItem;

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
    dispatch(setEpisodeInfoEmpty());
    dispatch(setSelectedContentId(0));
    dispatch(setSelectedChapterIdx(0));
    dispatch(setSelectedEpisodeIdx(0));
    dispatch(setPublishInfo(emptyContentInfo.publishInfo));

    onClose();
  };
  //#endregion

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh', maxWidth: '500px', margin: '0 auto'},
      }}
    >
      <Box className={styles.drawerContainer}>
        <CreateDrawerHeader title="Content Dashboard" onClose={onClose} />

        {/* Filter section */}
        <Box className={styles.filterContainer}>
          <Select className={styles.filterSelect}>
            <MenuItem value="filter1">Filter 1</MenuItem>
            <MenuItem value="filter2">Filter 2</MenuItem>
            <MenuItem value="filter3">Filter 3</MenuItem>
          </Select>
          <Button variant="contained" className={styles.createButton} onClick={handleCreateClick}>
            Create
          </Button>
        </Box>

        {/* Content list */}
        <ContentDashboardList contentInfo={contentInfo} selectedIndex={selectedIndex} onItemSelect={handleItemClick} />

        {/* Action buttons */}
        <Box className={styles.buttonContainer}>
          <Button variant="outlined" onClick={handleEditClick} disabled={selectedIndex === null}>
            Edit
          </Button>
          <Button variant="outlined">Preview</Button>
          <Button variant="outlined" onClick={handleDeleteClick} disabled={selectedIndex === null}>
            Delete
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ContentDashboardDrawer;
