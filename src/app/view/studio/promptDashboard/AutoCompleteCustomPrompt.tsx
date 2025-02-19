import React, {useRef, useState, useEffect} from 'react';
import styles from './AutoCompleteCustomPrompt.module.css';

interface Props {
  keywords: Record<string, string>;
  inputRef: React.RefObject<HTMLDivElement>;
  onInput: (e: React.FormEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const AutoCompleteCustomPrompt: React.FC<Props> = ({keywords, inputRef, onInput, onKeyDown}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputValue, setInputValue] = useState(''); // 부모의 값이 변경될 때 추적

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (showDropdown) {
      setSelectedIndex(0);
    }
  }, [showDropdown]);

  useEffect(() => {
    if (!inputRef.current) return;

    // 부모의 `contentEditable` 값이 변경될 때 감지
    const observer = new MutationObserver(() => {
      const newText = inputRef.current?.innerText || '';
      if (newText !== inputValue) {
        setInputValue(newText);
        handleLocalInput(newText);
      }
    });

    observer.observe(inputRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [inputRef, inputValue]);

  useEffect(() => {
    if (!inputRef.current) return;

    const inputElement = inputRef.current;
    inputElement.addEventListener('keydown', handleLocalKeyDown as EventListener);

    return () => inputElement.removeEventListener('keydown', handleLocalKeyDown as EventListener);
  }, [inputRef, inputValue]);

  const handleLocalInput = (text: string) => {
    if (text.includes('{') && !text.includes('}')) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }

    if (inputRef.current) {
      const event = new Event('input', {bubbles: true});
      inputRef.current.dispatchEvent(event);
    }
  };

  const handleLocalKeyDown = (e: KeyboardEvent) => {
    if (showDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Object.keys(keywords).length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Object.keys(keywords).length) % Object.keys(keywords).length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        insertKeyword(Object.keys(keywords)[selectedIndex]);
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    }
  };

  const insertKeyword = (keyword: string) => {
    if (!inputRef.current) return;

    document.execCommand('insertText', false, keyword);
    setShowDropdown(false);

    if (inputRef.current) {
      const event = new Event('input', {bubbles: true});
      inputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className={styles.autoCompleteContainer}>
      {showDropdown && (
        <ul ref={dropdownRef} className={styles.dropdown}>
          {Object.keys(keywords).map((keyword, index) => (
            <li
              key={keyword}
              className={`${styles.dropdownItem} ${index === selectedIndex ? styles.selected : ''}`}
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
