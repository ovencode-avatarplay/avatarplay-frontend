import React, {useState, useEffect, RefObject} from 'react';
import styles from './MaxTextInput.module.css';
import ErrorMessage from './ErrorMessage';

interface Props {
  promptValue: string;
  placeholder?: string;
  handlePromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputDataType?: inputType;
  displayDataType?: displayType;
  stateDataType?: inputState;
  allowSpecialCharacters?: boolean; // 특수문자 허용 여부
  disabled?: boolean;
  maxPromptLength?: number;
  onFocus?: () => void;
  onBlur?: (event: React.FocusEvent) => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
  labelText?: string;
  hint?: string;
  onErrorChange?: (hasError: boolean) => void;
}

export enum inputType {
  None = 0, // 제한 없음
  OnlyNum = 1, // 숫자만 입력 가능
  OnlyNumMax100 = 2, // 숫자만 입력 가능 + 100까지만
}

export enum displayType {
  Default = 'default',
  Label = 'label',
  Hint = 'hint',
  LabelAndHint = 'labelAndHint',
}

export enum inputState {
  Normal = 'normal',
  Focused = 'focused',
  Typing = 'typing',
  Error = 'error',
  Disable = 'disable',
}

const MaxTextInput: React.FC<Props> = ({
  promptValue,
  placeholder,
  handlePromptChange,
  inputDataType = inputType.None,
  displayDataType = displayType.Default,
  stateDataType = inputState.Disable,
  allowSpecialCharacters = true,
  disabled = false,
  maxPromptLength,
  onFocus,
  onBlur,
  inputRef,
  labelText,
  hint,
  onErrorChange,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 상태
  const [currentState, setCurrentState] = useState<inputState>(stateDataType);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = event.target.value.replace(/^\s+/, ''); // 첫글자 앞의 공백 제거

    // 조합 중에는 입력을 허용
    if (isComposing && inputDataType != inputType.OnlyNum && inputDataType != inputType.OnlyNumMax100) {
      handlePromptChange(event);
      return;
    }

    // 숫자 입력만 허용 (OnlyNum, OnlyNumMax100)
    if (inputDataType === inputType.OnlyNum || inputDataType === inputType.OnlyNumMax100) {
      value = value.replace(/[^0-9]/g, ''); // 숫자만 남김

      // 빈 문자열이면 "0"으로 설정하여 NaN 방지
      if (value === '') {
        value = '0';
      }

      // OnlyNumMax100 제한
      if (inputDataType === inputType.OnlyNumMax100 && Number(value) > 100) {
        value = '100'; // 최대 100까지만 입력 가능
      }
    }

    // 특수문자만 제거, 띄어쓰기는 허용
    if (!allowSpecialCharacters) {
      value = value.replace(/[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?`~]/g, '');
    }

    // 새로운 이벤트 객체 생성하여 안전하게 값 전달
    const newEvent = {
      ...event,
      target: {
        ...event.target,
        value,
      },
    };

    handlePromptChange(newEvent as React.ChangeEvent<HTMLTextAreaElement>);

    if (!disabled) {
      setCurrentState(value ? inputState.Typing : inputState.Focused);
    } else {
      setCurrentState(inputState.Disable);
    }
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
      setHasError(promptValue.length >= maxPromptLength);
    }
  }, [promptValue, maxPromptLength]);

  useEffect(() => {
    if (onErrorChange) onErrorChange(hasError);
  }, [hasError]);

  const handleFocus = () => {
    if (!disabled && !hasError) {
      setCurrentState(inputState.Focused);
      if (onFocus) onFocus();
    } else {
      setCurrentState(inputState.Disable);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (!disabled && !hasError) {
      setCurrentState(inputState.Normal);
      if (onBlur) onBlur(event);
    } else {
      setCurrentState(inputState.Disable);
    }
  };

  return (
    <>
      {(displayDataType === displayType.Label || displayDataType === displayType.LabelAndHint) && labelText && (
        <div className={styles.label}>{labelText}</div>
      )}
      <div
        className={`${styles.inputArea} ${hasError && styles.inputAreaError} ${
          currentState === inputState.Focused && styles.inputAreaFocused
        } ${currentState === inputState.Typing && styles.inputAreaTyping}
        ${currentState === inputState.Disable && styles.inputAreaDisable}`}
      >
        <textarea
          className={`${styles.inputPrompt} ${hasError ? styles.inputError : ''}`}
          placeholder={placeholder ? placeholder : 'Text Placeholder'}
          value={promptValue}
          onChange={handleInput}
          onCompositionStart={handleCompositionStart} // 조합 시작
          onCompositionEnd={handleCompositionEnd} // 조합 종료
          maxLength={maxPromptLength}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
        />
        {maxPromptLength && (
          <div className={`${styles.inputHint} ${currentState === inputState.Error && styles.errorInputHint}`}>
            {promptValue.length} / {maxPromptLength}
          </div>
        )}
      </div>
      {(displayDataType === displayType.Hint || displayDataType === displayType.LabelAndHint) && hint && (
        <div className={styles.hintText}>{hint}</div>
      )}
      {/* 경고 메시지 */}
      {hasError && <ErrorMessage message="Character limit exceeded. Please shorten your input"></ErrorMessage>}
    </>
  );
};

export default MaxTextInput;
