import React, {useState} from 'react';
import styles from './EpisodeSetNamePopup.module.css';
import {Modal} from '@mui/material';

interface Props {
  open: boolean;
  onClickCancel: () => void;
  onClickComplete?: (nameResult: string) => void;
  onClickCompleteAlert?: () => void;
  title?: string;
  desc?: string;
  cancelText?: string;
  confirmText?: string;
  isAlert?: boolean;
}

const EpisodeSetNamePopup: React.FC<Props> = ({
  open,
  onClickCancel,
  onClickComplete,
  onClickCompleteAlert,
  title = 'Alert',
  desc = (
    <>
      Are you sure you want to cancel?
      <br />
      Your changes will be lost
    </>
  ),
  cancelText = 'No',
  confirmText = 'Yes',
  isAlert = false,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isAlertOn, setIsAlertOn] = useState<boolean>(isAlert);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCompleteClick = () => {
    if (onClickComplete) onClickComplete(inputValue);
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
        {isAlert ? (
          <>
            <div className={styles.title}>{title}</div>
            <div className={styles.alertMessage}>{desc}</div>
            <div className={styles.buttonArea}>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClickCancel}>
                {cancelText}
              </button>
              <button className={`${styles.button} ${styles.completeButton}`} onClick={onClickCompleteAlert}>
                {confirmText}
              </button>
            </div>
          </>
        ) : (
          // isAlertOn 상태에서 렌더링될 내용
          <>
            {isAlertOn ? (
              <>
                <div className={styles.title}>{title}</div>
                <div className={styles.alertMessage}>{desc}</div>
                <div className={styles.buttonArea}>
                  <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleClickAlertNo}>
                    {cancelText}
                  </button>
                  <button className={`${styles.button} ${styles.completeButton}`} onClick={handleClickAlertYes}>
                    {confirmText}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.title}>Episode Title</div>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Place Holder"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <div className={styles.buttonArea}>
                  <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleClickCancel}>
                    Cancel
                  </button>
                  <button className={`${styles.button} ${styles.completeButton}`} onClick={handleCompleteClick}>
                    Complete
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default EpisodeSetNamePopup;
