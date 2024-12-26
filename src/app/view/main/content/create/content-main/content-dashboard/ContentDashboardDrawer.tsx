import React, {useEffect, useRef, useState} from 'react';

import {Drawer} from '@mui/material';
import styles from './ContentDashboardDrawer.module.css';
import {BoldArrowDown} from '@ui/Icons';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {ContentInfo, setContentInfoToEmpty} from '@/redux-store/slices/ContentInfo';
import {setEpisodeInfoEmpty} from '@/redux-store/slices/EpisodeInfo';
import {
  setSelectedChapterIdx,
  setSelectedContentId,
  setSelectedEpisodeIdx,
  setSkipContentInit,
} from '@/redux-store/slices/ContentSelection';
import {setPublishInfo} from '@/redux-store/slices/PublishInfo';

import {sendContentDelete} from '@/app/NetWork/ContentNetwork';

import ContentDashboardList from './ContentDashboardList';
import ConfirmationDialog from '@/components/layout/shared/ConfirmationDialog';
import ContentDashboardHeader from './ContentDashboardHeader';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';

import EmptyContentInfo from '@/data/create/empty-content-info-data.json';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectItem: (id: number) => void;
  onRefreshItem: () => void;
  onClickCreate: () => void;
}

const ContentDashboardDrawer: React.FC<Props> = ({open, onClose, onSelectItem, onRefreshItem, onClickCreate}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const contentInfo = useSelector((state: RootState) => state.myContents.contentDashBoardList ?? []);
  const dispatch = useDispatch();
  const emptyContentInfo: ContentInfo = EmptyContentInfo.data.contentInfo as ContentInfo;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [filterPublishOpen, setFilterPublishOpen] = useState<boolean>(false);
  const [selectedPublish, setSelectedPublish] = useState<number>(0);

  /* TODO : 필터링 */
  const publishItems: SelectDrawerItem[] = [
    {
      name: 'All',
      onClick: () => {
        setSelectedPublish(0);
      },
    },
    {
      name: 'Saved',
      onClick: () => {
        setSelectedPublish(1);
      },
    },
    {
      name: 'Published',
      onClick: () => {
        setSelectedPublish(2);
      },
    },
  ];
  const [filterOptionOpen, setFilterOptionOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);

  /* TODO : 필터링 */
  const optionItems: SelectDrawerItem[] = [
    {
      name: 'Alphabetically',
      onClick: () => {
        console.log('Alphabetically Selected');
        setSelectedOption(0);
      },
    },
    {
      name: 'Last Modified',
      onClick: () => {
        console.log('Last Modified Selected');
        setSelectedOption(1);
      },
    },
    {
      name: 'Created On',
      onClick: () => {
        console.log('Created On Selected');
        setSelectedOption(2);
      },
    },
  ];

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
    dispatch(setSkipContentInit(false));
    onClickCreate();
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
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {width: '100vw', height: '100vh', maxWidth: '402px', margin: '0 auto'},
        }}
        BackdropProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.70)',
          },
        }}
      >
        <ContentDashboardHeader title="Story" onClose={onClose} onCreate={handleCreateClick} />
        <div className={styles.drawerContainer}>
          <div className={styles.filterContainer}>
            <button
              className={`${styles.filterBase} ${styles.filterPublish}`}
              onClick={() => setFilterPublishOpen(true)}
            >
              <div className={styles.filterData}>
                <div className={styles.filterName}>{publishItems[selectedPublish].name}</div>
                <img className={styles.filterIcon} src={BoldArrowDown.src} />
              </div>
            </button>
            <button className={`${styles.filterBase} ${styles.filterOption}`} onClick={() => setFilterOptionOpen(true)}>
              <div className={styles.filterData}>
                <div className={styles.filterName}>{optionItems[selectedOption].name}</div>
                <img className={styles.filterIcon} src={BoldArrowDown.src} />
              </div>
            </button>
          </div>

          {/* Content list */}
          <ContentDashboardList
            contentInfo={contentInfo}
            selectedIndex={selectedIndex}
            onItemSelect={handleItemClick}
            onItemEdit={handleEditClick}
            onItemDelete={handleOpenDialog}
          />
        </div>
        <SelectDrawer
          items={publishItems}
          isOpen={filterPublishOpen}
          onClose={() => {
            setFilterPublishOpen(false);
          }}
          selectedIndex={selectedPublish}
        />

        <SelectDrawer
          items={optionItems}
          isOpen={filterOptionOpen}
          onClose={() => {
            setFilterOptionOpen(false);
          }}
          selectedIndex={selectedOption}
        />
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
