import {useState} from 'react';
import styles from './WorkroomUploadState.module.css';
import {LineArrowDown, LineCheck, LineClose, LineRefresh} from '@ui/Icons';

interface WorkroomUploadStateProps {
  uploadStateList: UploadStateItem[];
  onClose: () => void;
}

export interface UploadStateItem {
  id: number;
  name: string;
  state: 'uploading' | 'uploaded' | 'failed';
}

const WorkroomUploadState: React.FC<WorkroomUploadStateProps> = ({uploadStateList, onClose}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleItemCancel = (id: number) => {
    console.log('item cancel' + id);
  };

  const handleItemRefresh = (id: number) => {
    console.log('item refresh' + id);
  };

  const renderUploadStateItem = (item: UploadStateItem) => {
    return (
      <div className={styles.uploadStateItem}>
        <div className={styles.infoArea}>
          <div className={styles.leftArea}>
            <div className={styles.itemText}>{item.name}</div>
            <div className={styles.itemState}>{item.state}</div>
          </div>
          <div className={styles.rightArea}>
            {item.state === 'uploading' ? (
              <button className={styles.itemButton} onClick={() => handleItemCancel(item.id)}>
                <img src={LineClose.src} alt="close" />
              </button>
            ) : item.state === 'uploaded' ? (
              <button className={styles.itemButton} onClick={() => {}}>
                <img src={LineCheck.src} alt="close" />
              </button>
            ) : item.state === 'failed' ? (
              <button className={styles.itemButton} onClick={() => handleItemRefresh(item.id)}>
                <img src={LineRefresh.src} alt="close" />
              </button>
            ) : null}
          </div>
        </div>
        <div className={styles.gaugeArea}>
          <div
            className={`${styles.gaugeBar} ${
              item.state === 'uploaded' ? styles.uploaded : item.state === 'failed' ? styles.failed : styles.uploading
            }`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.uploadStateArea}>
      <div className={styles.uploadStateHeader}>
        <div className={styles.headerText}>Uploading Files {uploadStateList.length}</div>
        <div className={styles.headerButtonArea}>
          <button className={styles.headerButton}>
            <img
              src={LineArrowDown.src}
              alt="close"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              style={{transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)'}}
            />
          </button>
          <button
            className={styles.headerButton}
            onClick={() => {
              onClose();
            }}
          >
            <img src={LineClose.src} alt="close" />
          </button>
        </div>
      </div>
      {isOpen && (
        <ul className={styles.uploadStateItemList}>
          {uploadStateList
            .sort((a, b) => b.id - a.id)
            .map(item => (
              <li key={item.id}>{renderUploadStateItem(item)}</li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default WorkroomUploadState;
