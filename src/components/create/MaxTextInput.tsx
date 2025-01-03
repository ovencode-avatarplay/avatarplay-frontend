import React, {useState, useEffect, RefObject} from 'react';
import styles from './MaxTextInput.module.css';
import ErrorMessage from './ErrorMessage';

interface Props {
  promptValue: string;
  handlePromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  type?: inputType;
  allowSpecialCharacters?: boolean; // 특수문자 허용 여부
  disabled?: boolean;
  maxPromptLength?: number;
  hint?: string;
  onFocus?: () => void;
  onBlur?: (event: React.FocusEvent) => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

export enum inputType {
  None = 0, // 제한 없음
  OnlyNum = 1, // 숫자만 입력 가능
  OnlyNumMax100 = 2, // 숫자만 입력 가능 + 100까지만
}

const MaxTextInput: React.FC<Props> = ({
  promptValue,
  handlePromptChange,
  type = inputType.None,
  allowSpecialCharacters = true,
  disabled,
  maxPromptLength,
  hint,
  onFocus,
  onBlur,
  inputRef,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 상태

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = event.target.value;

    // 조합 중에는 입력을 허용
    if (isComposing) {
      handlePromptChange(event);
      return;
    }

    // OnlyNum 및 OnlyNumMax100에 대한 처리
    if (type === inputType.OnlyNum || type === inputType.OnlyNumMax100) {
      value = value.replace(/[^0-9]/g, ''); // 숫자만 허용

      // OnlyNumMax100 제한
      if (type === inputType.OnlyNumMax100 && Number(value) > 100) {
        value = '100';
      }
    }

    // 특수문자 허용 여부 처리
    if (!allowSpecialCharacters) {
      value = value.replace(/[^가-힣a-zA-Z0-9\s]/g, ''); // 한글, 알파벳, 숫자, 공백만 허용
    }

    // 값 업데이트
    event.target.value = value;
    handlePromptChange(event);
  };

  // 조합 상태 시작
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 조합 상태 종료
  const handleCompositionEnd = (event: React.CompositionEvent<HTMLTextAreaElement>) => {
    setIsComposing(false);
    handleInput(event as unknown as React.ChangeEvent<HTMLTextAreaElement>);
  };

  // promptValue와 maxPromptLength를 기반으로 hasError 상태 업데이트
  useEffect(() => {
    if (maxPromptLength !== undefined) {
      setHasError(promptValue.length > maxPromptLength);
    }
  }, [promptValue, maxPromptLength]);

  return (
    <>
      <div className={`${styles.inputArea} ${hasError ? styles.inputErrorArea : ''}`}>
        <textarea
          className={`${styles.inputPrompt} ${hasError ? styles.inputError : ''}`}
          placeholder="Text Placeholder"
          value={promptValue}
          onChange={handleInput}
          onCompositionStart={handleCompositionStart} // 조합 시작
          onCompositionEnd={handleCompositionEnd} // 조합 종료
          maxLength={maxPromptLength}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
        />
        {maxPromptLength && (
          <div className={styles.inputHint}>
            {promptValue.length} / {maxPromptLength}
          </div>
        )}
      </div>
      <div style={{height: '10px'}}></div>
      {hint && <div className={styles.inputHint}>{hint}</div>}
      {/* 경고 메시지 */}
      {hasError && <ErrorMessage message="Character limit exceeded. Please shorten your input"></ErrorMessage>}
    </>
  );
};

export default MaxTextInput;
