import React from 'react';
import {BoldArrowDown} from '@ui/Icons'; // 아이콘 임포트
import styles from './CreateFilterButton.module.css'; // 스타일 임포트

interface CreateFilterButtonProps {
  name: string;
  selectedItem: any;
  onClick: () => void;
  style?: React.CSSProperties;
}

const CreateFilterButton: React.FC<CreateFilterButtonProps> = ({name, selectedItem, onClick, style}) => {
  return (
    <button className={`${styles.filterBase} ${styles.filterPublish}`} onClick={onClick} style={style}>
      <div className={styles.filterData}>
        <div className={styles.filterName}>{selectedItem?.name || name}</div>
        <img className={styles.filterIcon} src={BoldArrowDown.src} />
      </div>
    </button>
  );
};

export default CreateFilterButton;
