import React, {useState} from 'react';
import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './DrawerCustomPromptPreview.module.css';
import {useEffect} from 'react';

interface KeywordData {
  keyword: string;
  description: string;
  example: any;
  type: number;
}

interface Props {
  keywordData: KeywordData[];
  editableExamples: {[key: string]: string};
  handleExampleChange: (keyword: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DrawerCustomPromptPreview: React.FC<Props> = ({keywordData, editableExamples, handleExampleChange}) => {
  const [focusedStates, setFocusedStates] = useState<{[key: string]: boolean}>({});
  const [typingStates, setTypingStates] = useState<{[key: string]: boolean}>({});

  const handleFocus = (key: string) => {
    setFocusedStates(prev => ({...prev, [key]: true}));
  };

  const handleBlur = (key: string) => {
    setFocusedStates(prev => ({...prev, [key]: false}));
  };

  useEffect(() => {
    console.log('Re-rendering DrawerCustomPromptPreview');
  }, [editableExamples, keywordData]);

  return (
    <div className={styles.previewContainer}>
      {keywordData.map((item, index) => (
        <tr key={index} className={styles.previewItem}>
          <td className={styles.previewDescArea}>
            <div className={styles.previewKeyword}>{item.keyword}</div>
            <div className={styles.previewDesc}>{item.description}</div>
          </td>

          {/* 기본 입력 필드 */}
          {item.type === 0 && (
            <CustomInput
              textType="InputOnly"
              inputType="Basic"
              value={editableExamples[item.keyword]}
              onChange={e => handleExampleChange(item.keyword, e)}
              customClassName={[styles.previewExampleInput]}
            />
          )}

          {/* 여러 줄 입력 (textarea) */}
          {item.type === 1 && (
            <textarea
              className={`${styles.previewExampleText} ${focusedStates[item.keyword] ? styles.Focused : ''} ${
                typingStates[item.keyword] ? styles.Typing : ''
              }`}
              value={editableExamples[item.keyword]}
              onChange={e => handleExampleChange(item.keyword, e)}
              onFocus={() => handleFocus(item.keyword)}
              onBlur={() => handleBlur(item.keyword)}
              rows={3}
            />
          )}

          {/* 예제 대화 (User-Character) */}
          {item.type === 2 && (
            <div className={styles.dialogueContainer}>
              {Array.isArray(item.example) &&
                item.example.map((ex, i) => (
                  <div key={i} className={styles.dialogueRow}>
                    {/* 사용자 발화 */}
                    {ex.user !== undefined && (
                      <div className={styles.dialogueItem}>
                        {/* "{{user}}" 기본값 출력 */}
                        <div className={styles.dialogueTitle}>{editableExamples[`{{user}}`] ?? '{{user}}'}</div>
                        <CustomInput
                          textType="InputOnly"
                          inputType="Basic"
                          value={editableExamples[`${item.keyword}_${i}_user`] ?? ex.user ?? ''}
                          onChange={e => handleExampleChange(`${item.keyword}_${i}_user`, e)}
                          customClassName={[styles.previewExampleInput]}
                        />
                      </div>
                    )}

                    {/* 캐릭터 발화 */}
                    {ex.char !== undefined && (
                      <div className={styles.dialogueItem}>
                        {/* "{{char}}" 기본값 출력 */}
                        {editableExamples[`{{char}}`] ?? '{{char}}'}

                        <CustomInput
                          textType="InputOnly"
                          inputType="Basic"
                          value={editableExamples[`${item.keyword}_${i}_char`] ?? ex.char ?? ''}
                          onChange={e => handleExampleChange(`${item.keyword}_${i}_char`, e)}
                          customClassName={[styles.previewExampleInput]}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </tr>
      ))}
    </div>
  );
};

export default DrawerCustomPromptPreview;
