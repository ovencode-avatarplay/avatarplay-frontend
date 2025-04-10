import React, {useState} from 'react';
import styles from './RecentSearchList.module.css';
import {LinePlus} from '@ui/Icons';

interface Props {
  initialItems: string[];
  onRemove?: (keyword: string) => void;
}

const RecentSearchList: React.FC<Props> = ({initialItems, onRemove}) => {
  const [items, setItems] = useState<string[]>(initialItems);

  const handleRemove = (keyword: string) => {
    const updated = items.filter(item => item !== keyword);
    setItems(updated);
    onRemove?.(keyword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Recent Searches</span>
      </div>

      <div className={styles.list}>
        {items.map(item => (
          <div key={item} className={styles.item}>
            <span className={styles.keyword}>{item}</span>

            <button className={styles.clearButton} onClick={() => handleRemove(item)}>
              <img src={LinePlus.src} alt="clear" className={styles.clearIcon} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearchList;
