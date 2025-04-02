import React from 'react';
import styles from './CustomArrowHeader.module.css';
import {LineArrowLeft} from '@ui/Icons';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';

interface Props {
  title: string;
  onClose?: () => void;
  backLink?: string; // ✅ 'backLint' → 'backLink' 수정
  children?: React.ReactNode;
}

const CustomArrowHeader: React.FC<Props> = ({title, onClose, children, backLink}) => {
  return (
    <header className={styles.header}>
      <div className={styles.baseArea}>
        {backLink ? (
          <Link href={getLocalizedLink(backLink)} className={styles.backButton}>
            <img src={LineArrowLeft.src} className={styles.backIcon} />
          </Link>
        ) : (
          <button className={styles.backButton} onClick={onClose}>
            <img src={LineArrowLeft.src} className={styles.backIcon} />
          </button>
        )}

        <h1 className={styles.navTitle}>{title}</h1>
      </div>
      {children && <div className={styles.childrenArea}>{children}</div>}
    </header>
  );
};

export default CustomArrowHeader;
