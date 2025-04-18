import React from 'react';
import styles from './WorkroomFileMoveModal.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import getLocalizedText from '@/utils/getLocalizedText';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {WorkroomItemInfo} from './WorkroomItem';
import {BoldFolderPlus, LineArrowRight, LineFolderPlus} from '@ui/Icons';
import {Dialog, DialogTitle} from '@mui/material';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

interface Props {
  open: boolean;
  onClose: () => void;
  folders: WorkroomItemInfo[];
}

const WorkroomFileMoveModal: React.FC<Props> = ({open, onClose, folders}) => {
  const renderFolder = () => {
    return (
      <ul className={styles.folderArea}>
        {folders.map((item, index) => (
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
        <button className={styles.folderButton}>
          <img src={LineArrowRight.src} />
        </button>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 'calc(100% - 32px)',
          height: '100%',
          maxHeight: '100%',

          maxWidth: '1300px',
          margin: '0 auto',
        },
      }}
    >
      <CreateDrawerHeader
        title={getLocalizedText('TODO : Move to a folder')}
        onClose={() => {
          onClose();
        }}
      >
        <button className={styles.createButton} onClick={() => {}}>
          <img src={LineFolderPlus.src} />
        </button>
      </CreateDrawerHeader>
      <ul className={styles.fileMoveDrawerContainer}>
        <div className={styles.searchArea}></div>
        <Splitters
          splitters={[
            {label: 'Folder', content: <>{renderFolder()}</>},
            {label: 'Gallery', content: <>{renderGallery()}</>},
          ]}
          splitterStyle={{margin: 'auto'}}
          headerStyle={{margin: 'auto', gap: '30px'}}
        />
      </ul>
    </Dialog>
  );
};

export default WorkroomFileMoveModal;
