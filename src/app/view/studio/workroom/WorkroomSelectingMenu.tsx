import React from 'react';
import styles from './WorkroomSelectingMenu.module.css';
import {LineFolderPlus, LineDelete, LineClose, LineShare, LineDownload} from '@ui/Icons'; // 아이콘은 임의로 예시 import

interface Props {
  selectedCount: number;
  onShare: () => void;
  onDownload: () => void;
  onMoveToFolder: () => void;
  onMoveToTrash: () => void;
  onExitSelecting: () => void;
}

const WorkroomSelectingMenu: React.FC<Props> = ({
  selectedCount,
  onShare,
  onDownload,
  onMoveToFolder,
  onMoveToTrash,
  onExitSelecting,
}) => {
  return (
    <div className={styles.selectingMenuContainer}>
      <div className={styles.leftArea}>
        <p className={styles.selectionCount}>{`${selectedCount}개 선택함`}</p>
      </div>
      <div className={styles.centerArea}>
        <button className={styles.iconButton} aria-label="Share" onClick={onShare}>
          <img src={LineShare.src} alt="Share" />
        </button>
        <button className={styles.iconButton} aria-label="Download" onClick={onDownload}>
          <img src={LineDownload.src} alt="Download" />
        </button>
        <button className={styles.iconButton} aria-label="MoveFolder" onClick={onMoveToFolder}>
          <img src={LineFolderPlus.src} alt="Move to folder" />
        </button>
        <button className={styles.iconButton} aria-label="Delete" onClick={onMoveToTrash}>
          <img src={LineDelete.src} alt="Move to trash" />
        </button>
      </div>
      <div className={styles.rightArea}>
        <button className={styles.iconButton} aria-label="Close" onClick={onExitSelecting}>
          <img src={LineClose.src} alt="Close selecting mode" />
        </button>
      </div>
    </div>
  );
};

export default WorkroomSelectingMenu;
