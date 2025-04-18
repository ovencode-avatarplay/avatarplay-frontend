import React from 'react';
import styles from './WorkroomEditDrawer.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import getLocalizedText from '@/utils/getLocalizedText';
import {LineArrowRight, LineEdit} from '@ui/Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  name: string;
  info: string;
  onCopy?: () => void;
  onMove?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

const WorkroomEditDrawer: React.FC<Props> = ({
  open,
  onClose,
  name,
  info,
  onCopy,
  onMove,
  onShare,
  onDownload,
  onDelete,
}) => {
  return (
    <CustomDrawer open={open} onClose={onClose}>
      <ul className={styles.fileEditDrawerContainer}>
        <li className={styles.infoArea}>
          <div className={styles.nameArea}>
            <input className={styles.fileName} value={name} readOnly />
            <img className={styles.editIcon} src={LineEdit.src} />
          </div>
          <div className={styles.infoText}>{info}</div>
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
        <li className={styles.editDrawerButton} onClick={onDelete}>
          {getLocalizedText('TODO : Delete')}
        </li>
      </ul>
    </CustomDrawer>
  );
};

export default WorkroomEditDrawer;
