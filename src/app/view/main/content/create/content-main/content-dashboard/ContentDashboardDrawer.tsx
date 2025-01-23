import React, {useEffect, useRef, useState} from 'react';

import {Drawer} from '@mui/material';
import styles from './ContentDashboardDrawer.module.css';
import {BoldArrowDown} from '@ui/Icons';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {
  setSelectedChapterIdx,
  setSelectedContentId,
  setSelectedEpisodeIdx,
  setSkipContentInit,
  ContentInfo,
  setContentInfoToEmpty,
  setEpisodeInfoEmpty,
} from '@/redux-store/slices/ContentInfo';
import {setPublishInfo} from '@/redux-store/slices/PublishInfo';

import {sendContentDelete} from '@/app/NetWork/ContentNetwork';

import ContentDashboardList from './ContentDashboardList';
import ContentDashboardHeader from './ContentDashboardHeader';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';

import EmptyContentInfo from '@/data/create/empty-content-info-data.json';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CreateFilterButton from '@/components/create/CreateFilterButton';

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

  const getFilteredAndSortedContent = () => {
    let filtered = [...contentInfo];

    // 필터 적용
    if (selectedPublish === 1) {
      filtered = filtered.filter(item => item.visibilityType === 3);
    } else if (selectedPublish === 2) {
      filtered = filtered.filter(item => item.visibilityType !== 3);
    }

    // 정렬 적용
    if (selectedOption === 0) {
      filtered.sort((a, b) => a.name.localeCompare(b.name)); // 알파벳 순서
    } else if (selectedOption === 1) {
      filtered.sort((a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()); // 수정일 역순
    } else if (selectedOption === 2) {
      filtered.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()); // 생성일 역순
    }

    return filtered;
  };

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
      const selectedItemId = getFilteredAndSortedContent()[selectedIndex]?.id;
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
          sx: {width: 'var(--full-width)', height: '100vh', margin: '0 auto'},
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
            <CreateFilterButton
              name=""
              selectedItem={publishItems[selectedPublish]}
              onClick={() => setFilterPublishOpen(true)}
              style={{width: '100px'}}
            />
            <CreateFilterButton
              name=""
              selectedItem={optionItems[selectedOption]}
              onClick={() => setFilterOptionOpen(true)}
              style={{width: '140px'}}
            />
          </div>

          {/* Content list */}
          <ContentDashboardList
            contentInfo={getFilteredAndSortedContent()}
            selectedIndex={selectedIndex}
            onItemSelect={handleItemClick}
            onItemEdit={handleEditClick}
            onItemDelete={handleOpenDialog}
            dateOption={selectedOption}
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

      {dialogOpen && (
        <CustomPopup
          type="alert"
          title="Discard Content?"
          description="Data will be disappeared. Are you sure?"
          buttons={[
            {
              label: 'Cancel',
              onClick: handleCloseDialog,
              isPrimary: false,
            },
            {
              label: 'Okay',
              onClick: handleConfirm,
              isPrimary: true,
            },
          ]}
        />
      )}
    </>
  );
};

export default ContentDashboardDrawer;
