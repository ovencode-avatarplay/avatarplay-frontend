import React, {useState} from 'react';
import styles from './WorkroomFileMoveModal.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {WorkroomItemInfo} from './WorkroomItem';
import {BoldFolder, LineArrowRight, LineFolderPlus, LineSearch} from '@ui/Icons';
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
  onMoveToFolder: (targetFolder: WorkroomItemInfo | null, variationType?: number | null) => void;
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
  const [variationType, setVariationType] = useState<'None' | 'Portrait' | 'Pose' | 'Expression'>('None');

  const handleSelectFolder = (folder: WorkroomItemInfo) => {
    onSelectFolder(folder);
  };
  const getFilteredFolders = (gallery: boolean) => {
    return folders.filter(folder => {
      const filterGallery = folder.profileId ? gallery : !gallery;

      const matchKeyword = keyword.trim().length > 0 ? folder.name.toLowerCase().includes(keyword.toLowerCase()) : true;

      const inHierarchy = !selectedFolder
        ? !folder.folderLocation || folder.folderLocation.length === 0
        : folder.folderLocation?.[folder.folderLocation.length - 1] === selectedFolder.id;

      return keyword.trim().length > 0 ? matchKeyword : inHierarchy && filterGallery;
    });
  };

  //#region Render

  const renderFolder = () => {
    return (
      <ul className={styles.folderArea}>
        {getFilteredFolders(false).length > 0 ? (
          getFilteredFolders(false).map((item, index) => (
            <li className={styles.folderItem} key={index}>
              {renderFolderItem(item)}
            </li>
          ))
        ) : (
          <div className={styles.emptyStateContainer}>
            <EmptyState stateText={getLocalizedText('TODO : No results found')} />
          </div>
        )}
      </ul>
    );
  };

  const renderGallery = () => {
    return (
      <ul className={styles.folderArea}>
        {selectedFolder === null ? (
          getFilteredFolders(true).length > 0 ? (
            getFilteredFolders(true).map((item, index) => (
              <li className={styles.folderItem} key={index}>
                {renderGalleryItem(item)}
              </li>
            ))
          ) : (
            <li className={styles.folderItem}>
              <div className={styles.emptyStateContainer}>
                <EmptyState stateText={getLocalizedText('TODO : No results found')} />
              </div>
            </li>
          )
        ) : (
          <div className={styles.galleryContainer}>
            {variationType === 'None' ? (
              ['Portrait', 'Pose', 'Expression'].map((type, idx) => (
                <div className={styles.folderItem} key={idx}>
                  <div
                    className={styles.folderItemContainer}
                    onClick={() => setVariationType(type as 'Portrait' | 'Pose' | 'Expression')}
                  >
                    <div className={styles.folderIcon}>
                      <img src={BoldFolder.src} />
                    </div>
                    <div className={styles.infoArea}>
                      <div className={styles.folderName}>{getLocalizedText(`TODO : ${type}`)}</div>
                    </div>
                    <button className={styles.folderButton}>
                      <img src={LineArrowRight.src} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.galleryItemContainer}>
                <div className={styles.galleryItemText}>{getLocalizedText(`TODO : ${variationType}`)}</div>
              </div>
            )}
          </div>
        )}
      </ul>
    );
  };

  const renderFolderItem = (data: WorkroomItemInfo) => {
    return (
      <div className={styles.folderItemContainer} onClick={() => handleSelectFolder(data)}>
        <div className={styles.folderIcon}>
          <img src={BoldFolder.src} />
        </div>
        <div className={styles.infoArea}>
          <div className={styles.folderName}>{data.name}</div>
          <div className={styles.folderDetail}>{data.detail}</div>
        </div>
        <button className={styles.folderButton}>
          <img src={LineArrowRight.src} />
        </button>
      </div>
    );
  };

  const renderGalleryItem = (data: WorkroomItemInfo) => {
    return (
      <div className={styles.folderItemContainer} onClick={() => handleSelectFolder(data)}>
        <div className={styles.galleryFolderImg}>
          <img src={data.imgUrl} />
        </div>
        <div className={styles.infoArea}>
          <div className={styles.folderName}>{data.name}</div>
          <div className={styles.folderDetail}>{data.detail}</div>
        </div>
        <button className={styles.folderButton}>
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
              onClick={() => {
                if (variationType !== 'None') {
                } else {
                  onSelectFolder(null);
                }
                setVariationType('None');
              }}
              customClassName={[styles.button]}
            >
              {getLocalizedText('TODO : Cancel')}
            </CustomButton>
            {selectedFolder.profileId === undefined ? (
              <CustomButton
                size="Medium"
                state="Normal"
                type="Primary"
                onClick={() => {
                  onMoveToFolder(selectedFolder, null);
                  onSelectFolder(null);
                }}
                customClassName={[styles.button]}
              >
                {getLocalizedText('TODO : Move here')}
              </CustomButton>
            ) : variationType !== 'None' ? (
              <CustomButton
                size="Medium"
                state="Normal"
                type="Primary"
                customClassName={[styles.button]}
                onClick={() => {
                  onMoveToFolder(
                    selectedFolder,
                    variationType === 'Portrait'
                      ? 1
                      : variationType === 'Pose'
                      ? 2
                      : variationType === 'Expression'
                      ? 3
                      : null,
                  );
                  onSelectFolder(null);
                }}
              >
                {getLocalizedText('TODO : Move Gallery')}
              </CustomButton>
            ) : (
              <div className={styles.button}></div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default WorkroomFileMoveModal;
