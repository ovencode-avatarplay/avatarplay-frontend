import React, {RefObject} from 'react';
import styles from './ButtonPromptInput.module.css';
import PromptInput from '@/app/view/studio/promptDashboard/PromptInput';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAI} from '@ui/Icons';
import formatText from '@/utils/formatText';

interface Props {
  promptRef: RefObject<HTMLDivElement>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onClickAI: () => void;
  placeholder?: string;
  maxLength?: number;
  essential?: boolean;
  Keywords: Record<string, string>;
  showAutoComplete: boolean;
  dropdownPos: {top: number; left: number};
  setDropdownPosition: (pos: {top: number; left: number}) => void;
}

const ButtonPromptInput: React.FC<Props> = ({
  promptRef,
  value,
  setValue,
  onClickAI,
  placeholder,
  maxLength,
  essential,
  Keywords,
  showAutoComplete,
  dropdownPos,
  setDropdownPosition,
}) => {
  const convertTextToHTML = (text: string): string => {
    let html = text.trim();

    html = html.replace(/\n/g, '<br>');

    Object.keys(Keywords).forEach(keyword => {
      const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g');
      html = html.replace(
        regex,
        `<span class="${styles['chip']} ${styles[`chip${Keywords[keyword]}`]}" contenteditable="false">${
          Keywords[keyword]
        }</span>\u00A0`,
      );
    });
    return html;
  };

  const handleButtonClick = (text: string) => {
    const div = promptRef.current;
    if (!div) return;

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    div.focus();

    const chipHTML = convertTextToHTML(`{{${text}}}`);

    if (range && div.contains(range.commonAncestorContainer)) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = chipHTML;
      const chipElement = tempDiv.firstChild;

      range.deleteContents();
      range.insertNode(chipElement as Node);

      const space = document.createTextNode('\u00A0'); // non-breaking space
      chipElement?.after(space);

      setTimeout(() => {
        const newRange = document.createRange();
        newRange.setStartAfter(space);
        newRange.collapse(true);

        selection?.removeAllRanges();
        selection?.addRange(newRange);
      }, 0);
    } else {
      div.insertAdjacentHTML('beforeend', ` ${chipHTML}`);

      const newRange = document.createRange();
      newRange.selectNodeContents(div);
      newRange.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }

    const event = new Event('input', {bubbles: true});
    div.dispatchEvent(event);
  };

  return (
    <div className={styles.maxTextInputArea}>
      <div className={`${styles.promptInputContainer} ${essential && value.length === 0 ? styles.isError : ''}`}>
        <div className={styles.promptInputArea}>
          <PromptInput
            prefix={''}
            suffix={''}
            promptRef={promptRef}
            showAutoComplete={showAutoComplete}
            Keywords={Keywords}
            dropdownPos={dropdownPos}
            setDropdownPosition={pose => setDropdownPosition} /* dangerouse */
            setShowAutoComplete={() => {}}
            setState={setValue}
            dropdownOffset={{top: 0, left: 0}}
            placeholder={placeholder}
          />
        </div>
        <div className={styles.hintTextArea}>
          {maxLength ? (
            <>
              {value.length} / {maxLength} {essential ? '' : ''}
            </>
          ) : (
            <>
              {formatText(getLocalizedText('CreateCharacter', 'createcharacter001_label_013'), [
                value.length.toString(),
              ])}
            </>
          )}
        </div>
      </div>
      <div className={styles.maxTextButtonArea}>
        <button className={`${styles.maxTextButton} ${styles.aiButton}`} onClick={onClickAI}>
          <img className={styles.maxTextButtonIcon} src={BoldAI.src} />
        </button>
        <button className={styles.maxTextButton} onClick={() => handleButtonClick('user')}>
          {getLocalizedText('Common', 'common_button_usercommand')}
        </button>
        <button className={styles.maxTextButton} onClick={() => handleButtonClick('char')}>
          {getLocalizedText('Common', 'common_button_charcommand')}
        </button>
      </div>
    </div>
  );
};

export default ButtonPromptInput;
