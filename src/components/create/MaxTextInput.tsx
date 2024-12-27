import React from 'react';
import styles from './MaxTextInput.module.css';

interface Props {
  promptValue: string;
  handlePromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxPromptLength: number;
}

const MaxTextInput: React.FC<Props> = ({promptValue, handlePromptChange, maxPromptLength}) => {
  return (
    <div className={styles.inputArea}>
      <textarea
        className={styles.inputPrompt}
        placeholder="Text Placeholder"
        value={promptValue}
        onChange={handlePromptChange}
        maxLength={maxPromptLength}
      />

      <div className={styles.inputHint}>
        {promptValue.length} / {maxPromptLength}
      </div>
    </div>
  );
};

export default MaxTextInput;
