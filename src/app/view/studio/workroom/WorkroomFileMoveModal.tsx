import React, {useState} from 'react';
import styles from './WorkroomFileMoveModal.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {WorkroomItemInfo} from './WorkroomItem';
import {BoldFolderPlus, LineArrowRight, LineFolderPlus, LineSearch} from '@ui/Icons';
import {Dialog} from '@mui/material';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CustomButton from '@/components/layout/shared/CustomButton';
import EmptyState from '@/components/search/EmptyState';

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
  const [keyword, setKeyword] = useState('');

  const handleSelectFolder = (folder: WorkroomItemInfo) => {
    onSelectFolder(folder);
  };
  const getFilteredFolders = () => {
    return folders.filter(folder => {
      const matchKeyword = keyword.trim().length > 0 ? folder.name.toLowerCase().includes(keyword.toLowerCase()) : true;

      const inHierarchy = !selectedFolder
        ? !folder.folderLocation || folder.folderLocation.length === 0
        : folder.folderLocation?.[folder.folderLocation.length - 1] === selectedFolder.id;

      return keyword.trim().length > 0 ? matchKeyword : inHierarchy;
    });
  };

  //#region Render

  const renderFolder = () => {
    return (
      <ul className={styles.folderArea}>
        {getFilteredFolders().length > 0 ? (
          getFilteredFolders().map((item, index) => (
            <li className={styles.folderItem} key={index}>
              {renderFolderItem(item)}
            </li>
          ))
        ) : (
          <EmptyState stateText={getLocalizedText('TODO : No results found')} />
        )}
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

  const renderSearchBar = () => {
    return (
      <div className={styles.searchBar}>
        <img className={styles.searchIcon} src={LineSearch.src} />
        <input
          type="text"
          placeholder={getLocalizedText('TODO : Search Folders')}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>
    );
  };
  //#endregion

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
        <div className={styles.searchArea}>{renderSearchBar()}</div>
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
