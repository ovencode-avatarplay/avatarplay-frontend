import React, {RefObject, useEffect, useState} from 'react';
import styles from './PromptInput.module.css';
import AutoCompleteCustomPrompt from './AutoCompleteCustomPrompt';
import {SetStateAction} from 'jotai';
import {updateDropdownPosition} from './FuncPrompt';

interface Props {
  prefix?: string;
  suffix?: string;
  showAutoComplete?: boolean;
  promptRef: RefObject<HTMLDivElement>;
  Keywords: Record<string, string>;
  dropdownPos: {top: number; left: number};
  setDropdownPosition: React.Dispatch<SetStateAction<{top: number; left: number}>>;
  setShowAutoComplete?: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const PromptInput: React.FC<Props> = ({
  prefix,
  suffix,
  showAutoComplete,
  promptRef,
  Keywords,
  dropdownPos,
  setDropdownPosition,
  setShowAutoComplete,
  setState,
}) => {
  //#region  입력 관련
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const div = e.currentTarget;
    let html = div.innerHTML.trim();

    // 모든 내용이 삭제된 경우 기본 공백 추가
    if (!html || html === '<br>') {
      div.innerHTML = '&nbsp;';
    } else {
      let changed = false;
      Object.keys(Keywords).forEach(keyword => {
        const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g');

        if (html.includes(keyword)) {
          html = html.replace(
            regex,
            `<span class="${styles['chip']} ${styles['chipUser']}" contenteditable="false">${Keywords[keyword]}</span>`,
          );
          changed = true;
        }
      });

      if (changed) {
        div.innerHTML = html;

        // 마지막으로 변경된 chip 요소를 찾고, 그 뒤로 커서를 이동
        const chips = div.querySelectorAll(`.${styles['chip']}`);
        if (chips.length > 0) {
          moveCaretAfterNode(chips[chips.length - 1]); // 가장 마지막 chip 뒤로 이동
        }
      }
    }
    setState(html);
    checkForAutoComplete(e);
  };

  // Handle change in the editor content
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const node = e.target as HTMLElement;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      const div = e.currentTarget;

      // 모든 내용을 삭제했을 경우 <br> 추가하여 커서 유지
      if (div.innerText.trim() === '') {
        e.preventDefault();
        div.innerHTML = '&nbsp;';
        moveCaretToEnd(div);
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 엔터 동작 방지

      const newLine = document.createElement('div');
      newLine.innerHTML = '<br>';

      range.insertNode(newLine);

      moveCaretToEnd(newLine);
    }

    if (e.key === 'Backspace' && node.classList.contains('chip')) {
      node.remove();
      e.preventDefault();
    }
  };

  //#endregion

  //#region  캐럿 (커서) 관련

  // 엔터로 개행 후, 캐럿을 새로운 줄 끝으로 이동
  const moveCaretToEnd = (el: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const moveCaretAfterNode = (node: Node) => {
    const range = document.createRange();
    const sel = window.getSelection();

    if (!node || !sel) return;

    range.setStartAfter(node);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  };

  //#endregion

  //#region  Chip 관련

  // {{User}} -> 칩
  const handleKeywordInsert = (
    div: HTMLDivElement,
    setstate: React.Dispatch<SetStateAction<string>>,
    keyword: string,
  ) => {
    if (!div) return;

    let html = div.innerHTML.trim();

    //  키워드를 바로 `chip`으로 변환
    html += ` <span class="${styles['chip']} ${styles['chipUser']}" contenteditable="false">${Keywords[keyword]}</span> `;

    div.innerHTML = html;
    setstate(html);

    //  캐럿을 `chip` 뒤로 이동
    const chips = div.querySelectorAll(`.${styles['chip']}`);
    if (chips.length > 0) {
      moveCaretAfterNode(chips[chips.length - 1]);
    }
  };

  //#endregion

  //#region  자동완성 관련
  const checkForAutoComplete = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    setShowAutoComplete?.(text.includes('{') && !text.includes('}'));
  };

  useEffect(() => {
    if (showAutoComplete) {
      updateDropdownPosition(promptRef, setDropdownPosition);
    }
  }, [showAutoComplete, promptRef, setDropdownPosition]);

  //#endregion

  return (
    <>
      <div className={styles.promptInputList}>
        <div className={styles.fixedPrompt}>{prefix}</div>

        <div
          ref={promptRef}
          className={styles.promptInput}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.fixedPrompt}>{suffix}</div>
      </div>
      {showAutoComplete && (
        <AutoCompleteCustomPrompt
          keywords={Keywords}
          inputRef={promptRef}
          onKeywordInsert={handleKeywordInsert}
          dropdownPosition={dropdownPos}
          setState={setState}
        />
      )}{' '}
    </>
  );
};

export default PromptInput;
