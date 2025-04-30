import React, {useEffect, useState} from 'react';
import styles from './WorkroomEditDrawer.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import getLocalizedText from '@/utils/getLocalizedText';
import {LineArrowRight, LineEdit} from '@ui/Icons';
import {WorkroomItemInfo} from './WorkroomItem';
import {MediaState} from '@/app/NetWork/ProfileNetwork';

interface Props {
  open: boolean;
  onClose: () => void;
  selectedItem: WorkroomItemInfo;
  onRename?: (newName: string) => void;
  onCopy?: () => void;
  onMove?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

const WorkroomEditDrawer: React.FC<Props> = ({
  open,
  onClose,
  selectedItem,
  onRename,
  onCopy,
  onMove,
  onShare,
  onDownload,
  onDelete,
  onRestore,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [fileName, setFileName] = useState(selectedItem.name);

  useEffect(() => {
    setFileName(selectedItem.name);
  }, [selectedItem]);

  const handleRenameConfirm = () => {
    setEditMode(false);
    if (fileName.trim() && fileName !== selectedItem.name) {
      onRename?.(fileName.trim());
    }
  };

  const isGalleryItem = selectedItem.mediaState === MediaState.None && selectedItem.profileId;

  return (
    <CustomDrawer open={open} onClose={onClose}>
      <ul className={styles.fileEditDrawerContainer}>
        {selectedItem.trash ? (
          <>
            <div className={styles.trashedfileName}>{fileName}</div>
            <li className={styles.editDrawerButton} onClick={onRestore}>
              {getLocalizedText('TODO : Restore Selected')}
            </li>
            <li className={styles.editDrawerButton} onClick={onDelete}>
              {getLocalizedText('TODO : Delete Permanently')}
            </li>
          </>
        ) : (
          <>
            <li className={styles.infoArea}>
              <div
                className={`${styles.nameArea} ${editMode ? styles.editMode : ''}`}
                onClick={() => {
                  if (!isGalleryItem) {
                    setEditMode(true);
                  }
                }}
              >
                <input
                  className={styles.fileName}
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  readOnly={!editMode}
                  onBlur={handleRenameConfirm}
                  onKeyDown={e => {
                    if (!isGalleryItem) {
                      if (e.key === 'Enter') handleRenameConfirm();
                    }
                  }}
                />
                {!isGalleryItem && (
                  <img
                    className={styles.editIcon}
                    src={LineEdit.src}
                    style={{cursor: 'pointer'}}
                    alt="edit"
                    onClick={() => setEditMode(true)}
                  />
                )}
              </div>
              <div className={styles.infoText}>{selectedItem.detail}</div>
            </li>
            <li className={styles.editDrawerButton} onClick={onCopy}>
              {getLocalizedText('TODO : Make a copy')}
            </li>
            <li className={styles.editDrawerButton} onClick={onMove}>
              {getLocalizedText('TODO : Move to a folder')}
              <button className={styles.editRightArrowButton}>
                <img src={LineArrowRight.src} />
              </button>
            </li>
            <li className={styles.editDrawerButton} onClick={onShare}>
              {getLocalizedText('TODO : Share')}
            </li>
            <li className={styles.editDrawerButton} onClick={onDownload}>
              {getLocalizedText('TODO : Download')}
            </li>
            {!selectedItem.profileId && (
              <li className={styles.editDrawerButton} onClick={onDelete}>
                {getLocalizedText('TODO : Delete')}
              </li>
            )}
          </>
        )}
      </ul>
    </CustomDrawer>
  );
};

export default WorkroomEditDrawer;
