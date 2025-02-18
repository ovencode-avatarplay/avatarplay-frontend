import React, {useState} from 'react';
import Link from 'next/link';

import styles from './ContentHeader.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setContentName} from '@/redux-store/slices/PublishInfo';
import {LeftArrow, LineDashboard, LineEdit} from '@ui/Icons';
import {useRouter} from 'next/navigation';
import CustomPopup from '@/components/layout/shared/CustomPopup';
interface ContentHeaderProps {
  lastUrl?: string;
  onOpenContentName: () => void;
  onOpenDrawer: () => void; // 스튜디오 버튼 클릭 시 호출될 함수
  onTitleChange: (newTitle: string) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({lastUrl, onOpenContentName, onOpenDrawer, onTitleChange}) => {
  const contentName = useSelector((state: RootState) => state.publish.storyName);
  const defaultUrl = '../main/homefeed';
  const dispatch = useDispatch();
  const router = useRouter();

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const [test, setTest] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    dispatch(setContentName(newTitle));
    onTitleChange(newTitle);
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    event.preventDefault(); // 기본 이동 중단
    setPendingNavigation(href); // 이동하려는 URL 저장
    setPopupOpen(true); // 팝업 열기
  };

  const handlePopupConfirm = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation); // 저장된 URL로 이동
    }
    setPopupOpen(false); // 팝업 닫기
  };

  const handlePopupCancel = () => {
    setPendingNavigation(null); // 대기 중인 URL 초기화
    setPopupOpen(false); // 팝업 닫기
  };

  return (
    <div className={styles.contentHeader}>
      <div className={styles.titleContainer}>
        <Link
          className={styles.goBackButton}
          href={lastUrl ? lastUrl : defaultUrl}
          passHref
          onClick={e => handleLinkClick(e, lastUrl ? lastUrl : defaultUrl)}
        >
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
      </div>{' '}
      {isPopupOpen && (
        <CustomPopup
          type="alert"
          title="Alert"
          description="Are you sure you want to exit?
Your changes will be lost"
          buttons={[
            {
              label: 'Cancel',
              onClick: handlePopupCancel,
              isPrimary: false,
            },
            {
              label: 'Leave',
              onClick: handlePopupConfirm,
              isPrimary: true,
            },
          ]}
        />
      )}
    </div>
  );
};

export default ContentHeader;
