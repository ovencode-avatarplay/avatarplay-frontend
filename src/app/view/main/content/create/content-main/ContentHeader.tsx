import React from 'react';
import Link from 'next/link';

import styles from './ContentHeader.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setContentName} from '@/redux-store/slices/PublishInfo';
import {LeftArrow, LineDashboard, LineEdit} from '@ui/Icons';
interface ContentHeaderProps {
  lastUrl?: string;
  onOpenContentName: () => void;
  onOpenDrawer: () => void; // 스튜디오 버튼 클릭 시 호출될 함수
  onTitleChange: (newTitle: string) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({lastUrl, onOpenContentName, onOpenDrawer, onTitleChange}) => {
  const contentName = useSelector((state: RootState) => state.publish.contentName);
  const defaultUrl = '../main/homefeed';
  const dispatch = useDispatch();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    dispatch(setContentName(newTitle));
    onTitleChange(newTitle);
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // TODO : 현재 편집중인 값이 emptydata와 동일한지 체크해서 경고 메시지 스킵

    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
    if (!confirmation) {
      event.preventDefault(); // 링크 이동 중단
    }
  };

  return (
    <div className={styles.contentHeader}>
      <div className={styles.titleContainer}>
        <Link className={styles.goBackButton} href={lastUrl ? lastUrl : defaultUrl} passHref onClick={handleLinkClick}>
          <img src={LeftArrow.src} className={styles.goBackIcon} />
        </Link>
        <div className={styles.contentName}>{contentName && contentName.trim() ? contentName : 'Story Name'}</div>
      </div>

      <div className={styles.headerButtonArea}>
        <button className={styles.headerButton} onClick={onOpenContentName}>
          <div className={styles.iconBox}>
            <img src={LineEdit.src} className={styles.headerIcon} />
          </div>
        </button>

        <button className={styles.headerButton} onClick={onOpenDrawer}>
          <div className={styles.iconBox}>
            <img src={LineDashboard.src} className={styles.headerIcon} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ContentHeader;
