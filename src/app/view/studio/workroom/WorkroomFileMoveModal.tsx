import React, {useState} from 'react';
import styles from './WorkroomFileMoveModal.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {WorkroomItemInfo} from './WorkroomItem';
import {BoldFolderPlus, LineArrowRight, LineFolderPlus} from '@ui/Icons';
import {Dialog} from '@mui/material';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CustomButton from '@/components/layout/shared/CustomButton';

interface Props {
  open: boolean;
  onClose: () => void;
  folders: WorkroomItemInfo[];
  addFolder: () => void;
  selectedTargetFolder: WorkroomItemInfo | null;
  onSelectTargetFolder: (folder: WorkroomItemInfo | null) => void;
  onMoveToFolder: (folderId: number | null) => void;
}

const WorkroomFileMoveModal: React.FC<Props> = ({
  open,
  onClose,
  folders,
  addFolder,
  onSelectTargetFolder: onSelectFolder,
  selectedTargetFolder: selectedFolder,
  onMoveToFolder,
}) => {
  const handleSelectFolder = (folder: WorkroomItemInfo) => {
    onSelectFolder(folder);
  };

  const renderFolder = () => {
    return (
      <ul className={styles.folderArea}>
        {folders
          .filter(item => {
            if (!selectedFolder) {
              // 루트 폴더만 표시 (folderLocation이 비어있거나 undefined)
              return !item.folderLocation || item.folderLocation.length === 0;
            } else {
              // 현재 선택된 폴더의 id를 포함하는 하위 폴더만 표시
              return item.folderLocation && item.folderLocation[item.folderLocation.length - 1] === selectedFolder.id;
            }
          })
          .map((item, index) => (
            <li className={styles.folderItem} key={index}>
              {renderFolderItem(item)}
            </li>
          ))}
      </ul>
    );
  };

  const renderGallery = () => {
    return <>Gallery</>;
  };

  const renderFolderItem = (data: WorkroomItemInfo) => {
    return (
      <div className={styles.folderItemContainer}>
        <div className={styles.folderIcon}>
          <img src={BoldFolderPlus.src} />
        </div>
        <div className={styles.infoArea}>
          <div className={styles.folderName}>{data.name}</div>
          <div className={styles.folderDetail}>{data.detail}</div>
        </div>
        <button className={styles.folderButton} onClick={() => handleSelectFolder(data)}>
          <img src={LineArrowRight.src} />
        </button>
      </div>
    );
  };

  return (
    <Dialog
      // className={styles.dialogueContainer}
      open={open}
      onClose={onClose}
      disableEnforceFocus
      disableAutoFocus
      PaperProps={{
        sx: {
          width: 'calc(100%)',
          maxWidth: '1300px',

          height: '100%',
          maxHeight: '100%',

          margin: '0 auto',
          borderRadius: '0px',
        },
      }}
    >
      <CreateDrawerHeader
        title={getLocalizedText('TODO : Move to a folder')}
        onClose={() => {
          onClose();
        }}
      >
        <button
          className={styles.createButton}
          onClick={() => {
            console.log('addFolder');
            addFolder();
          }}
        >
          <img src={LineFolderPlus.src} />
        </button>
      </CreateDrawerHeader>
      <div className={styles.fileMoveDrawerContainer}>
        <div className={styles.searchArea}></div>
        <Splitters
          splitters={[
            {label: getLocalizedText('TODO : Folder'), content: <>{renderFolder()}</>},
            {label: getLocalizedText('TODO : Gallery'), content: <>{renderGallery()}</>},
          ]}
          splitterStyle={{margin: '0'}}
          headerStyle={{margin: 'auto', gap: '30px', flex: '1 0 0', width: '100%', justifyContent: 'space-around'}}
        />
        {selectedFolder !== undefined && selectedFolder !== null && (
          <div className={styles.buttonArea}>
            <CustomButton
              size="Medium"
              state="Normal"
              type="Tertiary"
              onClick={() => onSelectFolder(null)}
              customClassName={[styles.button]}
            >
              {getLocalizedText('TODO : Cancel')}
            </CustomButton>
            <CustomButton
              size="Medium"
              state="Normal"
              type="Primary"
              onClick={() => {
                const targetFolderId = selectedFolder?.id ?? null;
                onMoveToFolder(targetFolderId);
                onSelectFolder(null);
              }}
              customClassName={[styles.button]}
            >
              {getLocalizedText('TODO : Move here')}
            </CustomButton>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default WorkroomFileMoveModal;
