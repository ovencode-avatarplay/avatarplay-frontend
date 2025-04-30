import React from 'react';
import styles from './WorkroomSelectingMenu.module.css';
import {LineFolderPlus, LineDelete, LineClose, LineShare, LineDownload, BoldFolder} from '@ui/Icons'; // 아이콘은 임의로 예시 import

interface Props {
  selectedCount: number;
  onShare?: () => void;
  onDownload?: () => void;
  onMoveToFolder?: () => void;
  onRestore?: () => void;
  onMoveToTrash?: () => void;
  onExitSelecting?: () => void;
  isTrash?: boolean;
}

const WorkroomSelectingMenu: React.FC<Props> = ({
  selectedCount,
  onShare,
  onDownload,
  onMoveToFolder,
  onRestore,
  onMoveToTrash,
  onExitSelecting,
  isTrash,
}) => {
  return (
    <div className={styles.selectingMenuContainer}>
      <div className={styles.leftArea}>
        <p className={styles.selectionCount}>{`${selectedCount}개 선택함`}</p>
      </div>
      <div className={styles.centerArea}>
        {!isTrash ? (
          <>
            {onShare && (
              <button className={styles.iconButton} aria-label="Share" onClick={onShare}>
                <img src={LineShare.src} alt="Share" />
              </button>
            )}
            {onDownload && (
              <button className={styles.iconButton} aria-label="Download" onClick={onDownload}>
                <img src={LineDownload.src} alt="Download" />
              </button>
            )}
            {onMoveToFolder && (
              <button className={styles.iconButton} aria-label="MoveFolder" onClick={onMoveToFolder}>
                <img src={BoldFolder.src} alt="Move to folder" />
              </button>
            )}
            {onMoveToTrash && (
              <button className={styles.iconButton} aria-label="Delete" onClick={onMoveToTrash}>
                <img src={LineDelete.src} alt="Move to trash" />
              </button>
            )}
          </>
        ) : (
          <>
            {onRestore && (
              <button className={styles.iconButton} aria-label="onRestore" onClick={onRestore}>
                <img src={BoldFolder.src} alt="Restore to folder" />
              </button>
            )}
            {onMoveToTrash && (
              <button className={styles.iconButton} aria-label="Delete" onClick={onMoveToTrash}>
                <img src={LineDelete.src} alt="Delete" />
              </button>
            )}
          </>
        )}
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
