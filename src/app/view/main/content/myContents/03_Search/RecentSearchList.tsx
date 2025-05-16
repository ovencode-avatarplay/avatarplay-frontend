import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import styles from './RecentSearchList.module.css';
import {CircleClose} from '@ui/Icons';

export function addSearch(keyword: string, items: string[], setItems: React.Dispatch<React.SetStateAction<string[]>>) {
  if (!keyword.trim()) return;
  const filtered = items.filter(item => item !== keyword);
  const next = [keyword, ...filtered].slice(0, 10);
  localStorage?.setItem('recent_searches', JSON.stringify(next));
  setItems([...next]);
}

const STORAGE_KEY = 'recent_searches';
const MAX_ITEMS = 10;

interface RecentSearchListProps {
  onSelect?: (keyword: string) => void;
  activeIndex?: number;
  onMouseMoveIndex?: (idx: number) => void;
}

const RecentSearchList = forwardRef<any, RecentSearchListProps>(
  ({onSelect, activeIndex = -1, onMouseMoveIndex}, ref) => {
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
      const saved = localStorage?.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    }, []);

    useImperativeHandle(ref, () => ({
      getItems: () => items,
    }));

    const removeSearch = (keyword: string) => {
      const next = items.filter(item => item !== keyword);
      localStorage?.setItem(STORAGE_KEY, JSON.stringify(next));
      setItems([...next]);
    };

    const clearAll = () => {
      localStorage?.removeItem(STORAGE_KEY);
      setItems([]);
    };

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>최근 검색어</span>
          {items.length > 0 && (
            <button className={styles.clearAllButton} onMouseDown={clearAll}>
              전체 삭제
            </button>
          )}
        </div>
        <div className={styles.list}>
          {items.length === 0 && <div className={styles.empty}>최근 검색어가 없습니다</div>}
          {items.map((item, idx) => (
            <div
              key={item}
              className={styles.item + (activeIndex !== -1 && activeIndex === idx ? ' ' + styles.active : '')}
              onMouseMove={() => onMouseMoveIndex?.(idx)}
            >
              <span className={styles.keyword} onMouseDown={() => onSelect?.(item)}>
                {item}
              </span>
              <button onMouseDown={() => removeSearch(item)}>
                <img src={CircleClose.src} alt="clear" className={styles.clearIcon} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export default RecentSearchList;
