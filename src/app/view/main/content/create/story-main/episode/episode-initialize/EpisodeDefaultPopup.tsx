import React, {useState} from 'react';
import styles from './EpisodeSetNamePopup.module.css';
import {Modal} from '@mui/material';

interface Props {
  open: boolean;
  onClickCancel: () => void;
  onClickComplete: (nameResult: string) => void;
  title: string;
  desc: string;
  cancelText: string;
  confirmText: string;
}

const EpisodeSetNamePopup: React.FC<Props> = ({
  open,
  onClickCancel,
  onClickComplete,
  title,
  desc,
  cancelText,
  confirmText,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isAlertOn, setIsAlertOn] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCompleteClick = () => {
    onClickComplete(inputValue);
  };

  const handleClickCancel = () => {
    if (inputValue !== '') {
      setIsAlertOn(true);
    } else {
      onClickCancel();
    }
  };

  const handleClickAlertNo = () => {
    setIsAlertOn(false);
  };
  const handleClickAlertYes = () => {
    setIsAlertOn(false);
    setInputValue('');
    onClickCancel();
  };

  return (
    <Modal open={open} onClose={() => {}}>
      <div className={styles.setNamePopup}>
        <>
          <div className={styles.title}>Alert</div>
          <div className={styles.alertMessage}>
            Are you sure you want to cancel?
            <br />
            Your changes will be lost
          </div>
          <div className={styles.buttonArea}>
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleClickAlertNo}>
              No
            </button>
            <button className={`${styles.button} ${styles.completeButton}`} onClick={handleClickAlertYes}>
              Yes
            </button>
          </div>
        </>
      </div>
    </Modal>
  );
};

export default EpisodeSetNamePopup;
