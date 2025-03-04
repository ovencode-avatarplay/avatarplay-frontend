import React, {useState, useRef, useEffect} from 'react';
import styles from './AutoCompleteCustomPrompt.module.css';

interface Props {
  keywords: Record<string, string>;
  inputRef: React.RefObject<HTMLDivElement>;
  onKeywordInsert: (e: HTMLDivElement, keyword: string) => void;
}

const AutoCompleteCustomPrompt: React.FC<Props> = ({keywords, inputRef, onKeywordInsert}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [currentTriggerWord, setCurrentTriggerWord] = useState<string>(''); // 현재 `{`로 시작하는 단어
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (showDropdown) setSelectedIndex(0);
  }, [showDropdown]);

  useEffect(() => {
    if (!inputRef.current) return;

    const handleInput = () => {
      if (!inputRef.current) return;

      const text = inputRef.current.innerText;
      const words = text.split(/\s+/);
      const lastWord = words.pop() || '';

      if (lastWord.startsWith('{')) {
        setCurrentTriggerWord(lastWord);
        const filteredKeywords = Object.keys(keywords).filter(kw => kw.startsWith(lastWord));
        setMatchedKeywords(filteredKeywords);
        setShowDropdown(filteredKeywords.length > 0);
      } else {
        setShowDropdown(false);
      }
    };

    inputRef.current.addEventListener('input', handleInput);
    return () => inputRef.current?.removeEventListener('input', handleInput);
  }, [inputRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDropdown) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % matchedKeywords.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + matchedKeywords.length) % matchedKeywords.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        insertKeyword(matchedKeywords[selectedIndex]);
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown, selectedIndex, matchedKeywords]);

  const insertKeyword = (keyword: string) => {
    if (!inputRef.current || !currentTriggerWord) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // 🔹 기존 `{`를 포함한 현재 단어를 제거 후, 키워드 삽입
    range.setStart(range.startContainer, range.startOffset - currentTriggerWord.length);
    range.deleteContents();

    // 🔹 handleKeywordInsert 호출하여 즉시 chip으로 변환
    onKeywordInsert(inputRef.current, keyword);

    setShowDropdown(false);
    setCurrentTriggerWord('');
  };

  const convertToChip = () => {
    if (!inputRef.current) return;

    let html = inputRef.current.innerHTML.trim();
    let changed = false;

    Object.keys(keywords).forEach(keyword => {
      const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g');

      if (html.includes(keyword)) {
        html = html.replace(
          regex,
          `<span class="${styles['chip']} ${styles['chipUser']}" contenteditable="false">${keywords[keyword]}</span>`,
        );
        changed = true;
      }
    });

    if (changed) {
      inputRef.current.innerHTML = html;

      const chips = inputRef.current.querySelectorAll(`.${styles['chip']}`);
      if (chips.length > 0) {
        moveCaretAfterNode(chips[chips.length - 1]);
      }
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

  return (
    <div className={styles.autoCompleteContainer}>
      {showDropdown && (
        <ul ref={dropdownRef} className={styles.dropdown}>
          {matchedKeywords.map((keyword, index) => (
            <li
              key={keyword}
              className={`${styles.autoCompleteItem} ${index === selectedIndex ? styles.selected : ''}`}
              onClick={() => insertKeyword(keyword)}
            >
              {keyword} - {keywords[keyword]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteCustomPrompt;
