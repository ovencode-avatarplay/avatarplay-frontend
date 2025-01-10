import React, {useEffect, useState} from 'react';
import styles from './EpisodeCardDropDown.module.css';
import {EpisodeInfo, setCurrentEpisodeInfo, updateEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {useDispatch, useSelector} from 'react-redux';
import {LineArrowSwap, LineCopy, LineDelete, LineEdit, LinePreview} from '@ui/Icons';
import {ChapterInfo, duplicateEpisode, removeEpisode} from '@/redux-store/slices/ContentInfo';
import {RootState, store} from '@/redux-store/ReduxStore';
import BottomRenameDrawer from './BottomRenameDrawer';
import Popup from '@/components/popup/Popup';

interface EpisodeCardDropDownProps {
  episodeInfo: EpisodeInfo;
  open: boolean;
  close: () => void;
  save: () => void;
}

const EpisodeCardDropDown: React.FC<EpisodeCardDropDownProps> = ({save, episodeInfo, open, close}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      dispatch(setCurrentEpisodeInfo(episodeInfo));
    }
  }, [episodeInfo]);

  const chapterInfo = useSelector((state: RootState) => {
    return state.content.curEditingContentInfo.chapterInfoList.find(chapter =>
      chapter.episodeInfoList.some(episode => episode.id === episodeInfo?.id),
    );
  });

  const [isEpisodeNameOn, setIsEpisodeNameOn] = useState<boolean>(false);
  const [isDeleteOn, setIsDeleteOn] = useState<boolean>(false);

  const handleSetEpisodeNameComplete = (name: string): boolean => {
    try {
      // Redux 상태 가져오기
      const state = store.getState(); // Redux store의 상태 가져오기
      const allEpisodes = state.content.curEditingContentInfo.chapterInfoList.flatMap(
        (chapter: ChapterInfo) => chapter.episodeInfoList,
      );

      // 중복 이름 확인
      const isDuplicateName = allEpisodes.some((episode: EpisodeInfo) => episode.name === name);

      if (isDuplicateName) {
        console.warn('Duplicate episode name found:', name);
        return false; // 중복된 이름이 있으면 false 반환
      }

      // Redux 상태 업데이트
      dispatch(updateEpisodeInfo({name}));

      // 상태 반영 이후 실행
      setTimeout(() => {
        save();
        setIsEpisodeNameOn(false);
        close();
      }, 0);

      // 성공적으로 완료되었음을 반환
      return true;
    } catch (error) {
      console.error('Error updating episode name:', error);

      // 오류가 발생했음을 반환
      return false;
    }
  };

  const HandleRemoveEpisode = (id: number) => {
    const episodeIndex = chapterInfo?.episodeInfoList.findIndex(episode => episode.id === episodeInfo?.id);

    if (episodeIndex !== 0 && chapterInfo?.episodeInfoList[0]) {
      dispatch(setCurrentEpisodeInfo(chapterInfo.episodeInfoList[0]));
    } else if (episodeIndex == 0 && chapterInfo && chapterInfo?.episodeInfoList.length > 1) {
      dispatch(setCurrentEpisodeInfo(chapterInfo.episodeInfoList[1]));
    } else if (episodeIndex == 0 && chapterInfo && chapterInfo?.episodeInfoList.length == 1) {
      alert('해당 에피소드는 삭제할 수 없습니다');
      return;
    }
    dispatch(removeEpisode(id));

    close();
  };

  const HandleDuplicateEpisode = (id: number) => {
    dispatch(duplicateEpisode(id));
    close();
  };

  return (
    <div className={styles.dropdown}>
      <div
        className={styles.dropdownItem}
        onClick={() => {
          setIsEpisodeNameOn(true);
        }}
      >
        <span className={styles.label}>Rename</span>
        <img src={LineEdit.src} className={styles.icon} />
      </div>
      <div className={styles.dropdownItem}>
        <span className={styles.label}>Change Order</span>
        <img src={LineArrowSwap.src} style={{transform: 'rotate(90deg)'}} className={styles.icon} />
      </div>
      <div className={styles.dropdownItem}>
        <span className={styles.label}>Preview this Episode</span>
        <img src={LinePreview.src} className={styles.icon} />
      </div>
      <div className={styles.dropdownItem} onClick={() => HandleDuplicateEpisode(episodeInfo.id)}>
        <span className={styles.label}>Duplicate</span>
        <img src={LineCopy.src} className={styles.icon} />
      </div>
      <div className={`${styles.dropdownItem} ${styles.deleteItemLabel}`} onClick={() => setIsDeleteOn(true)}>
        <span className={styles.deleteItemLabel}>Delete</span>
        <img src={LineDelete.src} className={styles.deleteItemIcon} />
      </div>
      {isDeleteOn && (
        <Popup
          type="alert"
          title="Are you sure?"
          description="Deleting your trigger is irreversible"
          buttons={[
            {
              label: 'Cancel',
              onClick: () => setIsDeleteOn(false),
              isPrimary: false,
            },
            {
              label: 'Delete',
              onClick: () => {
                HandleRemoveEpisode(episodeInfo.id);
                setIsDeleteOn(false);
              },
              isPrimary: true,
            },
          ]}
          onClose={() => setIsDeleteOn(false)}
        />
      )}
      <BottomRenameDrawer
        open={isEpisodeNameOn}
        onClose={() => setIsEpisodeNameOn(false)}
        onComplete={handleSetEpisodeNameComplete}
      />
    </div>
  );
};

export default EpisodeCardDropDown;
