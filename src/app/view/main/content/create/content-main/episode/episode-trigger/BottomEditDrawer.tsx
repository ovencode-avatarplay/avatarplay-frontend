import React, {useState} from 'react';
import {Drawer} from '@mui/material';
import styles from './BottomEditDrawer.module.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (inputValue: string) => boolean; // boolean 반환
  lastValue?: string;
}

const BottomRenameDrawer: React.FC<Props> = ({open, onClose, onComplete, lastValue = ''}) => {
  const [inputValue, setInputValue] = useState(lastValue);
  const [hasError, setHasError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (hasError) setHasError(false); // 입력 변경 시 에러 상태 초기화
  };

  const handleCompleteClick = () => {
    const isComplete = onComplete(inputValue);
    if (!isComplete) {
      setHasError(true); // 에러 상태 활성화
      return;
    }
    onClose();
  };

  return (
    <>
      {/* Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            background: 'transparent', // Drawer 투명 처리
            boxShadow: 'none', // 그림자 제거
            overflow: 'hidden',
            gap: '12px',
          },
        }}
      >
        {/* 경고 메시지 */}
        {hasError && (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage}>
              <div className={styles.errorIcon}></div>
              <span className={styles.errorText}>Duplicate name detected. Please choose a different name</span>
            </div>
          </div>
        )}

        <div className={styles.container}>
          <div className={styles.handleBar}></div>
          <div className={styles.header}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <h3 className={styles.title}>Rename</h3>
            <button onClick={handleCompleteClick} className={styles.doneButton}>
              Done
            </button>
          </div>
          <div className={`${styles.inputContainer} ${hasError ? styles.inputError : ''}`}>
            <input
              type="text"
              placeholder="Text Placeholder"
              value={inputValue}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default BottomRenameDrawer;
