import React, {useState} from 'react';
import {Drawer} from '@mui/material';
import styles from './BottomRenameDrawer.module.css';
import {inputType as InputType} from '@/components/create/MaxTextInput';

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (inputValue: string) => boolean; // boolean 반환
  lastValue?: string;
  name?: string;
  lineCount?: number;
  errorMessage?: string;
  maxTextLength?: number;
  inputType?: InputType; // 입력 제한 타입
}

const BottomRenameDrawer: React.FC<Props> = ({
  open,
  onClose,
  onComplete,
  lastValue = '',
  name = 'Rename',
  lineCount = 1,
  errorMessage = 'Duplicate name detected. Please choose a different name',
  maxTextLength,
  inputType,
}) => {
  const [inputValue, setInputValue] = useState(lastValue);
  const [hasError, setHasError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;

    // 입력 제한 적용
    switch (inputType) {
      case InputType.OnlyNum:
        text = text.replace(/[^0-9]/g, ''); // 숫자만 허용
        break;

      case InputType.OnlyNumMax100:
        text = text.replace(/[^0-9]/g, ''); // 숫자만 허용
        if (parseInt(text) > 100) {
          text = '100'; // 최대값 제한
        }
        break;

      default:
        // 제한 없음 (inputType.None)
        break;
    }

    // 최대 길이 초과 제한
    if (maxTextLength && text.length > maxTextLength) {
      setHasError(true); // 에러 상태 활성화
      return;
    } else {
      setHasError(false); // 에러 상태 해제
    }

    setInputValue(text); // 입력값 업데이트
  };

  const handleCompleteClick = () => {
    const isComplete = onComplete(inputValue);
    if (!isComplete) {
      setHasError(true); // 에러 상태 활성화
      return;
    }
    onClose();
  };

  const lineHeight = 18; // 한 줄 높이 (px 단위)
  return (
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
      style={{zIndex: '1399'}}
    >
      {/* 경고 메시지 */}
      {hasError && (
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>
            <div className={styles.errorIcon}></div>
            <span className={styles.errorText}>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.handleBar}></div>
        <div className={styles.header}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <h3 className={styles.title}>{name}</h3>
          <button onClick={handleCompleteClick} className={styles.doneButton}>
            Done
          </button>
        </div>
        <div className={`${styles.inputContainer} ${hasError ? styles.inputError : ''}`}>
          <textarea
            placeholder="Text Placeholder"
            value={inputValue}
            onChange={handleInputChange}
            className={styles.textarea}
            style={{
              lineHeight: `${lineHeight}px`,
              height: `${lineHeight * lineCount}px`, // 줄 수에 따른 높이 계산
              padding: '8px 12px', // 내부 여백
              borderRadius: '4px',
              resize: 'none', // 크기 조정 비활성화
              overflowY: 'auto', // 자동 스크롤 활성화
            }}
          />
          {maxTextLength && (
            <div className={styles.inputHint}>
              {inputValue.length} / {maxTextLength}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default BottomRenameDrawer;
