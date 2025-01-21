import React, {useState} from 'react';
import {Drawer, TextField} from '@mui/material';
import styles from './BottomRenameDrawer.module.css';
import {inputType as InputType} from '@/components/create/MaxTextInput';

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (inputValue: string) => boolean;
  lastValue?: string;
  name?: string;
  lineCount?: number;
  errorMessage?: string;
  maxTextLength?: number;
  inputType?: InputType;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;

    // 입력 제한 적용
    switch (inputType) {
      case InputType.OnlyNum:
        text = text.replace(/[^0-9]/g, '');
        break;

      case InputType.OnlyNumMax100:
        text = text.replace(/[^0-9]/g, '');
        if (parseInt(text) > 100) {
          text = '100';
        }
        break;

      default:
        break;
    }

    // 최대 길이 초과 제한
    if (maxTextLength && text.length > maxTextLength) {
      setHasError(true);
      return;
    } else {
      setHasError(false);
    }

    setInputValue(text);
  };

  const handleCompleteClick = () => {
    const isComplete = onComplete(inputValue);
    if (!isComplete) {
      setHasError(true);
      return;
    }
    onClose();
    setInputValue('');
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
          gap: '12px',
        },
      }}
      style={{zIndex: '1399'}}
    >
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
          <TextField
            placeholder="Text Placeholder"
            value={inputValue}
            onChange={handleInputChange}
            multiline
            fullWidth
            error={hasError}
            // helperText={hasError ? errorMessage : undefined}
            InputProps={{
              style: {
                borderRadius: '4px',
                border: 'none',
                boxShadow: 'none',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                padding: 0,
                '& fieldset': {
                  border: 'none', // 아웃라인 제거
                },
              },
              '& .MuiInputBase-input': {
                lineHeight: '19px',
                resize: 'none', // 크기 조절 비활성화
                overflow: 'hidden', // 스크롤 대신 높이 자동 조정
              },
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
