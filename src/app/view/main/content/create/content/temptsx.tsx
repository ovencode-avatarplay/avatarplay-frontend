import React, {useState} from 'react';
import styles from './CreateSeriesContent.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {LineDashboard} from '@ui/Icons';

interface CreateSeriesContentProps {
  onNext: () => void;
  onPrev: () => void;
}

const CreateSeriesContent: React.FC<CreateSeriesContentProps> = ({onNext, onPrev}) => {
  const handleConfirm = () => {
    onNext();
  };

  return (
    <div className={styles.container}>
      <CustomArrowHeader
        title="Create Series Contents"
        onClose={onPrev}
        children={
          <div className={styles.rightArea}>
            <button className={styles.dashBoard} onClick={() => {}}>
              <img className={styles.dashBoardIcon} src={LineDashboard.src} />
            </button>
          </div>
        }
      />

      <button className={styles.confirmButton} onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
};

export default CreateSeriesContent;
