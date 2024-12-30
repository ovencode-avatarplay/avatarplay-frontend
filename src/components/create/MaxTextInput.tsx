import React from 'react';
import styles from './MaxTextInput.module.css';

interface Props {
  promptValue: string;
  handlePromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxPromptLength: number;
  type?: inputType;
  allowSpecialCharacters?: boolean; // 특수문자 허용 여부
}

export enum inputType {
  None = 0, // 제한 없음
  OnlyNum = 1, // 숫자만 입력 가능
  OnlyNumMax100 = 2, // 숫자만 입력 가능 + 100까지만
}

const MaxTextInput: React.FC<Props> = ({
  promptValue,
  handlePromptChange,
  maxPromptLength,
  type = inputType.None,
  allowSpecialCharacters = true,
}) => {
  console.log('asdsadad', type);
  // 입력 제한 함수
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = event.target.value;

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
      value = value.replace(/[^a-zA-Z0-9\s]/g, ''); // 알파벳, 숫자, 공백만 허용
    }

    event.target.value = value;
    handlePromptChange(event);
  };

  return (
    <div className={styles.inputArea}>
      <textarea
        className={styles.inputPrompt}
        placeholder="Text Placeholder"
        value={promptValue}
        onChange={handleInput}
        maxLength={maxPromptLength}
      />
      <div className={styles.inputHint}>
        {promptValue.length} / {maxPromptLength}
      </div>
    </div>
  );
};

export default MaxTextInput;
